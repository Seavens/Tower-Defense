import { combineProducers } from "@rbxts/reflex";
import { inventorySlice, placementSlice } from "./slices";
import { profileSlice } from "./slices/player-slice";
import { receiverMiddleware } from "./middleware";
import { sharedSlices } from "shared/state/slices";
import type { InferActions, InferState } from "@rbxts/reflex";

export type ClientProducers = typeof clientSlices;
export type ClientProducer = typeof clientProducer;
export type ClientState = InferState<ClientProducer>;
export type ClientActions = InferActions<ClientProducer>;

export const clientSlices = {
	profile: profileSlice,
	inventory: inventorySlice,
	placement: placementSlice,
};
export const combinedSlices = {
	...clientSlices,
	...sharedSlices,
};

export const clientProducer = combineProducers(combinedSlices).applyMiddleware(receiverMiddleware());
