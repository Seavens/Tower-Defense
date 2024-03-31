import { Tower as API } from "shared/tower/api";
import { Collision, setCollision } from "shared/utils/collision";
import { ComponentTag } from "shared/components/types";
import { PALETTE } from "client/ui/constants";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { SELL_RATIO } from "shared/tower/constants";
import { TOWER_KEY_ATTRIBUTE } from "./constants";
import { itemDefinitions } from "shared/inventory/items";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "client/state/store";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { Mob } from "shared/mobs/api";
import type { ReplicatedTower, TowerTargeting } from "shared/tower/types";

const {
	assets: { towers: assets },
} = ReplicatedStorage;
const { map, placed, debris } = Workspace;

export class Tower extends API {
	public static towers = new Map<string, Tower>();

	public declare readonly id: TowerItemId;
	public declare readonly uuid: UUID;
	public declare readonly index: number;
	public declare readonly cframe: CFrame;
	public declare readonly owner: string;

	public readonly instance: Model;
	public sphere: Option<BasePart>;
	public circle: Option<BasePart>;

	protected declare readonly key: string;
	protected declare readonly unique: ItemTowerUnique;

	protected lastAttack = 0;
	protected lastTarget: Option<Mob>;

	public constructor(tower: ReplicatedTower) {
		super(tower);
		const { towers } = Tower;
		const { id, cframe, key } = this;
		const model = assets.FindFirstChild(id);
		if (model === undefined || !model.IsA("Model")) {
			throw `Could not find model for Tower(${id})!`;
		}
		const instance = model.Clone();
		setCollision(instance, Collision.Tower, true);
		instance.AddTag(ComponentTag.Tower);
		instance.PivotTo(cframe);
		instance.SetAttribute(TOWER_KEY_ATTRIBUTE, key);
		instance.Parent = placed;
		this.instance = instance;
		towers.set(key, this);
	}

	public static getTower(key: string): Option<Tower> {
		const { towers } = this;
		return towers.get(key);
	}

	public getGround(): number {
		const { spawn } = map;
		if (spawn === undefined) {
			return 0;
		}
		const position = spawn.Position;
		return position.Y;
	}

	public getTargeting(): TowerTargeting {
		const { id, key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			const definition = itemDefinitions[id];
			const { targeting: defaults } = definition.kind;
			const [targeting] = defaults;
			return targeting;
		}
		return tower.targeting;
	}

	public getUpgrades(): number {
		const { key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			return 1;
		}
		const { upgrades } = tower;
		return upgrades;
	}

	public getSphereSize(): Vector3 {
		const { id, unique } = this;
		const { range } = unique;
		const { kind } = itemDefinitions[id];
		const { range: base, upgrades } = kind;
		const index = this.getUpgrades();
		const [_, multiplier] = upgrades[index - 1];
		const radius = range * base * multiplier[1];
		const diameter = radius * 2;
		return new Vector3(diameter, diameter, diameter);
	}

	public getCircleSize(): Vector3 {
		const { instance, id, unique } = this;
		const { range } = unique;
		const { kind } = itemDefinitions[id];
		const { range: base, upgrades } = kind;
		const index = this.getUpgrades();
		const [_, multiplier] = upgrades[index - 1];
		const radius = range * base * multiplier[1];
		const position = instance.GetPivot().Position;
		const y = this.getGround();
		const distance = y - position.Y;
		const chord = 2 * math.sqrt(radius ** 2 - distance ** 2);
		return new Vector3(0.1, chord, chord);
	}

	public enableRange(): void {
		const { instance } = this;
		const size = instance.GetExtentsSize().div(2);

		const pivot = instance.GetPivot();
		const cframe = new CFrame(pivot.PointToWorldSpace(size).add(Vector3.yAxis.mul(size.Y * -2)));
		const sphere = new Instance("Part");
		sphere.Shape = Enum.PartType.Ball;
		sphere.Size = this.getSphereSize();
		sphere.CastShadow = false;
		sphere.Anchored = true;
		sphere.CFrame = cframe;
		sphere.Material = Enum.Material.ForceField;
		sphere.Color = new Color3(PALETTE.green.R, PALETTE.green.G, PALETTE.green.B);
		sphere.Transparency = 0.5;
		sphere.CanCollide = false;
		sphere.Parent = debris;
		this.sphere = sphere;

		const y = this.getGround();
		const ground = new CFrame(cframe.Position.X, y, cframe.Position.Z);
		const circle = new Instance("Part");
		circle.Shape = Enum.PartType.Cylinder;
		circle.Size = this.getCircleSize();
		circle.CastShadow = false;
		circle.Anchored = true;
		circle.CFrame = ground.mul(new CFrame(0, 0.05, 0)).mul(CFrame.Angles(0, 0, math.rad(90)));
		circle.Material = Enum.Material.SmoothPlastic;
		circle.Color = new Color3(PALETTE.green.R, PALETTE.green.G, PALETTE.green.B);
		circle.Transparency = 0.75;
		circle.CanCollide = false;
		circle.Parent = debris;
		this.circle = circle;
	}

	public upgradeRange(): void {
		const { sphere, circle } = this;
		if (sphere === undefined || circle === undefined) {
			return;
		}
		sphere.Size = this.getSphereSize();
		circle.Size = this.getCircleSize();
	}

	public disableRange(): void {
		const { sphere, circle } = this;
		sphere?.Destroy();
		circle?.Destroy();
	}

	public rotateToTarget(target: Vector3): void {
		const { instance, cframe } = this;
		const position = cframe.Position;
		const pivot = CFrame.lookAt(position, new Vector3(target.X, position.Y, target.Z), Vector3.yAxis);
		instance.PivotTo(pivot);
	}

	public getSellCost(): number {
		const { id, key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			const { kind } = itemDefinitions[id];
			const { cost } = kind;
			return cost;
		}
		const { kind } = itemDefinitions[id];
		const { cost } = kind;
		const upgradeIndex = this.getUpgrades();
		const { upgrades } = kind;

		let upgradeValue = 0;
		for (const index of $range(1, upgradeIndex)) {
			const [, , sell] = upgrades[index - 1];
			upgradeValue += sell * SELL_RATIO;
		}

		const value = upgradeValue + cost * SELL_RATIO;
		return value;
	}

	public destroy(): void {
		const { towers } = Tower;
		const { instance, sphere, circle, key } = this;
		towers.delete(key);
		instance.Destroy();
		sphere?.Destroy();
		circle?.Destroy();
	}
}
