import { combineProducers } from "@rbxts/reflex";
import { inventorySlice } from "./slices";
import { receiverMiddleware } from "./middleware";
import type { InferActions, InferState } from "@rbxts/reflex";

export type ClientProducers = typeof clientSlices;
export type ClientProducer = typeof clientProducer;
export type ClientState = InferState<ClientProducer>;
export type ClientActions = InferActions<ClientProducer>;

export const clientSlices = {
	inventory: inventorySlice,
};
export const combinedSlices = {
	...clientSlices,
};

export const clientProducer = combineProducers(combinedSlices).applyMiddleware(
	receiverMiddleware(),
	receiverMiddleware(),
);
