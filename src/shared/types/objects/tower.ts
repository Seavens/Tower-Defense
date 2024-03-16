import type { TowerId } from "../ids";

export interface TowerObject {
	id: TowerId;

	owner: number;
	original: number;

	damage: number;
	range: number;
	cooldown: number;

	uuid: string;
	timestamp: string;

	level: number;

	cost: number;

	locked: boolean;

	// rank?: number;
}
