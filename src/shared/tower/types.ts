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
	None = "tower_targeting:none",
}

export const enum TowerGrade {
	S = "tower_grade:s",
	A = "tower_grade:a",
	B = "tower_grade:b",
	C = "tower_grade:c",
	D = "tower_grade:d",
}

export const enum TowerVisual {
	SniperShot = "tower_visual:sniper_shot",
	HolyStrike = "tower_visual:holy_strike",
	TowerPlace = "tower_visual:tower_place",
}

export const enum TowerAnimation {
	Summon = "tower_animation:summon",
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
export const isTowerGrade = Flamework.createGuard<TowerGrade>();
export const isTowerVisual = Flamework.createGuard<TowerVisual>();
export const isTowerAnimation = Flamework.createGuard<TowerAnimation>();

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
