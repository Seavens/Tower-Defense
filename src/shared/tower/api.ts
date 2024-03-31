import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { ReplicatedTower, TowerTargeting } from "./types";

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

	public getUnique(): ItemTowerUnique {
		const { unique } = this;
		return unique;
	}

	public abstract getTargeting(): TowerTargeting;
	public abstract getUpgrades(): number;
	public abstract destroy(): void;
}
