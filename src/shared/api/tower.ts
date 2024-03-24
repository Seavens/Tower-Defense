import type { TargetId, TowerId } from "shared/types/ids";
import type { TowerObject } from "shared/types/objects";

export type TowerStats = Omit<TowerObject, "id" | "owner" | "original" | "uuid" | "timestamp" | "locked">;

export abstract class Tower {
	public readonly id: TowerId;
	public readonly uuid: string;
	public readonly index: number;
	public readonly cframe: CFrame;

	protected readonly key: string;

	public constructor(id: TowerId, uuid: string, index: number, cframe: CFrame) {
		this.id = id;
		this.uuid = uuid;
		this.index = index;
		this.cframe = cframe;
		this.key = `${uuid}_${index}`;
	}

	public getKey(): string {
		const { key } = this;
		return key;
	}

	public abstract getTargeting(): TargetId;
	public abstract destroy(): void;
}
