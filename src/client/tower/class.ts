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
const { placed, debris } = Workspace;

export class Tower extends API {
	public static towers = new Map<string, Tower>();

	public declare readonly id: TowerItemId;
	public declare readonly uuid: string;
	public declare readonly index: number;
	public declare readonly cframe: CFrame;
	public declare readonly owner: string;

	public readonly instance: Model;
	public range: Option<BasePart>;
	public rangeBottom: Option<BasePart>;

	public Y = Workspace.map.spawnLocation.CFrame.Position.Y;

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

	public enableRange(): void {
		const { instance, id, unique } = this;
		const { range } = unique;
		const { kind } = itemDefinitions[id];
		const { range: base, upgrades } = kind;
		const index = this.getUpgrades();
		const [_, multiplier] = upgrades[index - 1];
		const radius = range * base * multiplier[1];

		const cframe = instance.GetPivot();
		const circle = new Instance("Part");
		circle.Shape = Enum.PartType.Ball;
		circle.Size = new Vector3(radius * 2, radius * 2, radius * 2);
		circle.CastShadow = false;
		circle.Anchored = true;
		circle.CFrame = cframe;
		circle.Material = Enum.Material.ForceField;
		circle.Color = new Color3(PALETTE.green.R, PALETTE.green.G, PALETTE.green.B);
		circle.Transparency = 0.5;
		circle.CanCollide = false;
		circle.Parent = debris;
		this.range = circle;

		const cframeBottom = instance.GetPivot();
		const circleBottom = new Instance("Part");
		circleBottom.Shape = Enum.PartType.Cylinder;
		circleBottom.Size = new Vector3(0.5, radius * 2, radius * 2);
		circleBottom.CastShadow = false;
		circleBottom.Anchored = true;
		circleBottom.CFrame = cframeBottom.mul(CFrame.Angles(0, this.Y, math.pi / 2));
		circleBottom.Material = Enum.Material.SmoothPlastic;
		circleBottom.Color = new Color3(PALETTE.green.R, PALETTE.green.G, PALETTE.green.B);
		circleBottom.Transparency = 0.75;
		circleBottom.CanCollide = false;
		circleBottom.Parent = debris;
		this.rangeBottom = circleBottom;
	}

	public upgradeRange(): void {
		const { range: circle, rangeBottom: circle2 } = this;
		const { range: rangeUpgrade } = this.unique;
		if (rangeUpgrade === undefined || circle === undefined || circle2 === undefined) {
			return;
		}
		const { id } = this;
		const { range: base, upgrades } = itemDefinitions[id].kind;
		const index = this.getUpgrades();
		const [_, multiplier] = upgrades[index - 1];
		const radius = rangeUpgrade * base * multiplier[1];
		circle.Size = new Vector3(radius * 2, radius * 2, radius * 2);
		circle2.Size = new Vector3(1, radius * 2, radius * 2);
	}

	public disableRange(): void {
		const { range, rangeBottom } = this;
		range?.Destroy();
		rangeBottom?.Destroy();
	}

	public rotateToTarget(target: Vector3): void {
		const { instance, cframe } = this;
		const position = cframe.Position;
		const pivot = CFrame.lookAt(position, target, Vector3.yAxis);
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
			const [, , sell] = upgrades[index];
			upgradeValue += sell * SELL_RATIO;
		}

		const value = upgradeValue + cost * SELL_RATIO;
		return value;
	}

	public destroy(): void {
		const { towers } = Tower;
		const { instance, range, key } = this;
		towers.delete(key);
		instance.Destroy();
		range?.Destroy();
	}
}
