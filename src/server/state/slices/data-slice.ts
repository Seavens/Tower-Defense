import { combineProducers } from "@rbxts/reflex";
import { inventorySlice } from "./inventory-slice";
import type { InferState } from "@rbxts/reflex";

export type DataState = InferState<typeof dataSlice>;

export const dataSlice = combineProducers({
	inventory: inventorySlice,
});
