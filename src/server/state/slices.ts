import { dataSlice } from "server/players/data/slice";

export type ServerSlices = typeof serverSlices;

export const serverSlices = {
	data: dataSlice,
} as const;
