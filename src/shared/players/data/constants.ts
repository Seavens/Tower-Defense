import type { Data } from "./types";
import type { Item } from "shared/inventory/types";

export const DATA_TEMPLATE: Data = {
	profile: {
		level: 1,
		experience: 0,
		coins: 0,
		gems: 0,
		settings: {
			music: true,
			sfx: true,
			audioLevel: math.clamp(100, 0, 100),
			vfx: true,
			billboards: true,
		},
	},
	inventory: {
		stored: new Map<Slot, Item>(),
		equipped: new Array<Slot>(),
	},
};
