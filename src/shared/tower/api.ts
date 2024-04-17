import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { ReplicatedTower } from "./types";

export abstract class Tower {
	public readonly id: TowerItemId;
	public readonly uuid: UUID;
	public readonly index: number;
	public readonly cframe: CFrame;
	public readonly owner: string;

	protected readonly key: string;

	public constructor(tower: ReplicatedTower) {
		const { id, index, key, owner, position, unique, uuid } = tower;
		this.id = id;
		this.index = index;
		this.key = key;
		this.owner = owner;
		this.cframe = new CFrame(position);
		this.uuid = uuid;
	}

	public getKey(): string {
		const { key } = this;
		return key;
	}

	public abstract getReplicated(): ReplicatedTower;
	public abstract destroy(): void;
}
