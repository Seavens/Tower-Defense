import { Tower as API } from "shared/api/tower";
import { Collision } from "shared/types/enums";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { TowerDefinitions } from "shared/definitions/towers";
import { clientProducer } from "client/state/producer";
import { selectSpecificTower } from "shared/state/selectors";
import { setCollision } from "shared/functions/set-collision";
import type { Mob } from "./mob";
import type { TargetId, TowerId } from "shared/types/ids";

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
		setCollision(instance, Collision.Tower);
		instance.PivotTo(cframe);
		instance.Parent = placed;
		this.instance = instance;
	}

	public static getTower(key: string): Option<Tower> {
		const { towers } = this;
		return towers.get(key);
	}

	public getTargeting(): TargetId {
		const { id, key } = this;
		const tower = clientProducer.getState(selectSpecificTower(key));
		if (tower === undefined) {
			const {
				targeting: [targeting],
			} = TowerDefinitions[id];
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
