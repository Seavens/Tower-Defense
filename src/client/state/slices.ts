import { inventorySlice } from "client/inventory/slice";
import { placementSlice } from "client/placement/slice";
import { profileSlice } from "client/profile/slice";

export type ClientSlices = typeof clientSlices;

export const clientSlices = {
	profile: profileSlice,
	inventory: inventorySlice,
	placement: placementSlice,
};
