import type { TowerId } from "../ids";

export interface ReplicatedTower {
	id: TowerId;
	uuid: string;
	owner: string;
	position: Vector3;
	upgrades: number;
	index: number;
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
