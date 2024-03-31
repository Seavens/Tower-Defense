import { Flamework } from "@flamework/core";
import { isItemTowerUnique, isTowerItemId } from "shared/inventory/types";
import { isUUID } from "shared/guards";
import { t } from "@rbxts/t";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";

export const enum TowerTargeting {
	First = "tower_targeting:first",
	Last = "tower_targeting:last",
	Strongest = "tower_targeting:strongest",
	Weakest = "tower_targeting:weakest",
	Closest = "tower_targeting:closest",
	Farthest = "tower_targeting:furthest",
}

export interface ReplicatedTower {
	id: TowerItemId;
	uuid: UUID;
	owner: string;
	position: Vector3;
	upgrades: number;
	index: number;
	targeting: TowerTargeting;
	key: string;
	unique: ItemTowerUnique;
}

export const isTowerTargeting = Flamework.createGuard<TowerTargeting>();

export const isReplicatedTower: t.check<ReplicatedTower> = t.strictInterface({
	id: isTowerItemId,
	uuid: isUUID,
	owner: t.string,
	position: t.Vector3,
	upgrades: t.number,
	index: t.number,
	targeting: isTowerTargeting,
	key: t.string,
	unique: isItemTowerUnique,
});
