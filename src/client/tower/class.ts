import { Tower as API } from "shared/tower/api";
import { Collision, setCollision } from "shared/utils/collision";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "client/state/store";
import { towerDefinitions } from "shared/tower/definitions";
import type { Mob } from "shared/mobs/api";
import type { TowerId, TowerTargeting } from "shared/tower/types";

const {
	assets: { towers: assets },
} = ReplicatedStorage;
const { placed } = Workspace;

export class Tower extends API {
	public static towers = new Map<string, Tower>();

	public declare readonly id: TowerId;
	public declare readonly cframe: CFrame;
	public declare readonly uuid: string;

	public readonly instance: Model;

	protected lastAttack = 0;
	protected lastTarget: Option<Mob>;

	public constructor(id: TowerId, uuid: string, index: number, cframe: CFrame, upgrades: number) {
		const { towers } = Tower;
		super(id, uuid, index, cframe);
		const { key } = this;
		towers.set(key, this);
		const model = assets.FindFirstChild(id);
		if (model === undefined || !model.IsA("Model")) {
			// !! Handle this error?
			throw `Could not find model for Tower(${id})!`;
		}
		const instance = model.Clone();
		setCollision(instance, Collision.Tower, true);
		instance.PivotTo(cframe);
		instance.Parent = placed;
		this.instance = instance;
	}

	public static getTower(key: string): Option<Tower> {
		const { towers } = this;
		return towers.get(key);
	}

	public getTargeting(): TowerTargeting {
		const { id, key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			const {
				targeting: [targeting],
			} = towerDefinitions[id];
			return targeting;
		}
		return tower.targeting;
	}

	public rotateToTarget(target: Vector3): void {
		const { instance, cframe } = this;
		const position = cframe.Position;
		const pivot = CFrame.lookAt(position, target, Vector3.yAxis);
		instance.PivotTo(pivot);
	}

	public destroy(): void {
		const { towers } = Tower;
		const { instance, key } = this;
		towers.delete(key);
		instance.Destroy();
	}
}
