import type { Data } from "./types";
import type { TowerObject } from "shared/tower/types";

export const DATA_TEMPLATE: Data = {
	profile: {
		level: 1,
		experience: 0,
		coins: 0,
		gems: 0,
	},
	inventory: {
		stored: new Map<string, TowerObject>(),
		equipped: new Map<string, TowerObject>(),
	},
};
