import type { TowerId } from "shared/types/ids";
import type { TowerObject } from "shared/types/objects";

export type TowerStats = Omit<TowerObject, "id" | "owner" | "original" | "uuid" | "timestamp" | "locked">;

export abstract class Tower {
	public readonly id: TowerId;
	public readonly cframe: CFrame;
	public readonly uuid: string;
	public readonly stats: TowerStats;

	// !! Temporarily set `stats` to be `stats?`
	public constructor(id: TowerId, uuid: string, cframe: CFrame, stats: TowerStats) {
		this.id = id;
		this.cframe = cframe;
		this.uuid = uuid;
		this.stats = stats;
	}
	public abstract targeting(): void;
	public abstract attack(delta: number): void;
	public abstract sell(): void;
	public abstract upgrade(): void;
}
