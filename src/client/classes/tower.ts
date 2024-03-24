import { Tower as API } from "shared/api/tower";
import { Collision } from "shared/types/enums";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { setCollision } from "shared/functions/set-collision";
import { t } from "@rbxts/t";
import type { Mob } from "./mob";
import type { TowerId } from "shared/types/ids";
import type { TowerStats } from "shared/api/tower";

const { assets } = ReplicatedStorage;
const { towers } = assets;
const { placed } = Workspace;

export class Tower extends API {
	public readonly instance: Model;
	private lastAttack: number = 0;

	public constructor(id: TowerId, uuid: string, cframe: CFrame, stats: TowerStats) {
		super(id, uuid, cframe, stats);
		const model = towers.FindFirstChild(id);
		if (model === undefined || !model.IsA("Model")) {
			// !! Handle this error?
			throw "raaah";
		}
		const instance = model.Clone();
		setCollision(instance, Collision.Tower);
		instance.PivotTo(cframe);
		instance.Parent = placed;
		this.instance = instance;
		this.targeting();
	}

	public attack(delta: number): void {
		warn("Attack", delta);
		// Cooldown
		const { stats } = this;
		const { cooldown, range } = stats;

		const now = os.clock();
		if (now - this.lastAttack < cooldown) {
			return;
		}
		this.lastAttack = now;

		// Targeting
		const radius = this.cframe.Position;
		warn("Targeting", radius, range);
	}

	public targeting(): void {}
	public sell(): void {}
	public upgrade(): void {}
}
