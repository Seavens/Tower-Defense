import { DEFAULT_SETTINGS } from "../settings/constants";
import type { Data } from "./types";
import type { Item } from "shared/inventory/types";

export const DATA_TEMPLATE: Data = {
	profile: {
		level: 1,
		experience: 0,
		coins: 1000,
		gems: 100,
	},
	inventory: {
		stored: new Map<Slot, Item>(),
		equipped: new Array<Slot>(),
	},
	settings: {
		values: DEFAULT_SETTINGS,
	},
};
