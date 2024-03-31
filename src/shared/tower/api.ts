import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { ReplicatedTower } from "./types";

export abstract class Tower {
	public readonly id: TowerItemId;
	public readonly uuid: UUID;
	public readonly index: number;
	public readonly cframe: CFrame;
	public readonly owner: string;

	protected readonly key: string;
	protected readonly unique: ItemTowerUnique;

	public constructor(tower: ReplicatedTower) {
		const { id, index, key, owner, position, unique, uuid } = tower;
		this.id = id;
		this.index = index;
		this.key = key;
		this.owner = owner;
		this.cframe = new CFrame(position);
		this.unique = unique;
		this.uuid = uuid;
	}

	public getKey(): string {
		const { key } = this;
		return key;
	}

	public getUnique(): Readonly<ItemTowerUnique> {
		const { unique } = this;
		return unique;
	}

	public abstract getReplicated(): ReplicatedTower;
	public abstract destroy(): void;
}
