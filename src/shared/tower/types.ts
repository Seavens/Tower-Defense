import { Flamework } from "@flamework/core";
import { t } from "@rbxts/t";

export const enum TowerId {
	Sniper = "tower_id:sniper",
	Melee = "tower_id:melee",
	God = "tower_id:god",
	Blunt = "tower_id:blunt",
}

export const enum TowerTargeting {
	First = "tower_targeting:first",
	Last = "tower_targeting:last",
	Strongest = "tower_targeting:strongest",
	Weakest = "tower_targeting:weakest",
	Closest = "tower_targeting:closest",
	Farthest = "tower_targeting:furthest",
}

export interface TowerObject {
	id: TowerId;
	owner: number;
	original: number;

	damage: number; // Multiplier
	range: number;
	cooldown: number;

	uuid: string;
	timestamp: string;

	level: number;
	cost: number;
	locked: boolean;

	// rank?: number;
}

export interface ReplicatedTower {
	id: TowerId;
	uuid: string;
	owner: string;
	position: Vector3;
	upgrades: number;
	index: number;
	targeting: TowerTargeting;
	key: string;
}

export const isTowerId = Flamework.createGuard<TowerId>();
export const isTowerTargeting = Flamework.createGuard<TowerTargeting>();

export const isTowerObject: t.check<TowerObject> = t.strictInterface({
	id: isTowerId,
	owner: t.number,
	original: t.number,

	damage: t.number,
	range: t.number,
	cooldown: t.number,

	uuid: t.string,
	timestamp: t.string,

	level: t.number,
	cost: t.number,
	locked: t.boolean,
});

export const isReplicatedTower: t.check<ReplicatedTower> = t.strictInterface({
	id: isTowerId,
	uuid: t.string,
	owner: t.string,
	position: t.Vector3,
	upgrades: t.number,
	index: t.number,
	targeting: isTowerTargeting,
	key: t.string,
});
