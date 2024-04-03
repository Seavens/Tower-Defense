import { clientSlices } from "./slices";
import { combineProducers } from "@rbxts/reflex";
import { receiverMiddleware } from "client/replication/middleware";
import { sharedSlices } from "shared/state/slices";
import type { InferActions, InferState } from "@rbxts/reflex";

export type ClientStore = typeof store;
export type ClientState = InferState<ClientStore>;
export type ClientActions = InferActions<ClientStore>;

export const combinedSlices = {
	...clientSlices,
	...sharedSlices,
};

export const store = combineProducers(combinedSlices).applyMiddleware(receiverMiddleware());
