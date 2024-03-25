import { dataSlice } from "server/data/slice";
import type { InventoryState, ProfileState } from "server/data/slice";

export type ServerSlices = typeof serverSlices;

export const serverSlices = {
	data: dataSlice,
} as const;

export type { InventoryState, ProfileState };
