import { inventorySlice } from "client/inventory/slice";
import { placementSlice } from "client/tower/placement/slice";
import { profileSlice } from "client/players/profile/slice";
import { settingSlice } from "client/players/profile/settings";
import { towerUISlice } from "client/tower/slice";
import { uiSlice } from "client/ui/slice";

export type ClientSlices = typeof clientSlices;

export const clientSlices = {
	profile: profileSlice,
	inventory: inventorySlice,
	placement: placementSlice,
	tower_ui: towerUISlice,
	ui: uiSlice,
	setting: settingSlice,
};
