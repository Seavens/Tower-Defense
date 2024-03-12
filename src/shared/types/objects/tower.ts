import type { TowerId } from "../ids";

export interface Tower {
	id: TowerId;

	owner: number;
	original: number;

	damage: number;
	range: number;
	attackSpeed: number;

	uuid: string;
	timestamp: number;

	level: number;

	cost: number;

	// rank?: number;
}
