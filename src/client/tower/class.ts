import { Tower as API } from "shared/tower/api";
import { Collision, setCollision } from "shared/utils/collision";
import { ComponentTag } from "shared/components/types";
import { Events } from "client/network";
import { PALETTE } from "client/ui/constants";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { TOWER_KEY_ATTRIBUTE } from "./constants";
import { TowerUtil } from "shared/tower/utils";
import { itemDefinitions } from "shared/inventory/items";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "client/state/store";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { Mob } from "shared/mob/api";
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

	public getReplicated(): ReplicatedTower {
		const { key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			// Unreachable under normal circumstances.
			throw "Tower does not exist!";
		}
		return tower;
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

	public getRange(origin = this.getGround()): number {
		const replicated = this.getReplicated();
		const range = TowerUtil.getTotalRange(replicated);
		const ground = this.getGround();
		const displacement = origin - ground;
		const chord = 2 * math.sqrt(range ** 2 - displacement ** 2);
		return chord;
	}

	public upgradeTower(): void {
		const { instance, key, sphere, circle } = this;
		if (sphere !== undefined) {
			const size = this.getRange();
			sphere.Size = Vector3.one.mul(size);
		}
		if (circle !== undefined) {
			const cframe = instance.GetPivot();
			const position = cframe.Position;
			const offset = position.Y;
			const size = this.getRange(offset);
			circle.Size = new Vector3(0.1, size, size);
		}
		Events.tower.upgrade(key);
	}

	public enableVisuals(): void {
		const { instance } = this;
		const offset = instance.GetExtentsSize().div(2);
		const pivot = instance.GetPivot();
		const relative = new CFrame(pivot.PointToWorldSpace(offset).add(Vector3.yAxis.mul(offset.Y * -2)));

		const sphere = new Instance("Part");
		sphere.Shape = Enum.PartType.Ball;
		sphere.Size = Vector3.one.mul(this.getRange());
		sphere.CastShadow = false;
		sphere.Anchored = true;
		sphere.CFrame = relative;
		sphere.Material = Enum.Material.ForceField;
		sphere.Color = new Color3(PALETTE.green.R, PALETTE.green.G, PALETTE.green.B);
		sphere.Transparency = 0.5;
		sphere.CanCollide = false;
		sphere.Parent = debris;
		this.sphere = sphere;

		const ground = this.getGround();
		const position = pivot.Position;
		const size = this.getRange(position.Y);
		const circle = new Instance("Part");
		circle.Shape = Enum.PartType.Cylinder;
		circle.Size = new Vector3(0.1, size, size);
		circle.CastShadow = false;
		circle.Anchored = true;
		circle.CFrame = new CFrame(relative.Position.X, ground, relative.Position.Z)
			.mul(new CFrame(0, 0.05, 0))
			.mul(CFrame.Angles(0, 0, math.rad(90)));
		circle.Material = Enum.Material.SmoothPlastic;
		circle.Color = new Color3(PALETTE.green.R, PALETTE.green.G, PALETTE.green.B);
		circle.Transparency = 0.75;
		circle.CanCollide = false;
		circle.Parent = debris;
		this.circle = circle;
	}

	public disableVisuals(): void {
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

	public destroy(): void {
		const { towers } = Tower;
		const { instance, sphere, circle, key } = this;
		towers.delete(key);
		instance.Destroy();
		sphere?.Destroy();
		circle?.Destroy();
	}
}
