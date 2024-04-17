import { dataSlice } from "server/players/data/slice";
import type { InventoryState, ProfileState } from "server/players/data/slice";

export type ServerSlices = typeof serverSlices;

export const serverSlices = {
	data: dataSlice,
} as const;

export type { InventoryState, ProfileState };
