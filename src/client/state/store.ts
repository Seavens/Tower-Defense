import { clientSlices } from "./slices";
import { combineProducers } from "@rbxts/reflex";
import { receiverMiddleware } from "client/replication/middleware";
import { sharedSlices } from "shared/state/slices";
import type { InferActions, InferState } from "@rbxts/reflex";

export type ClientProducer = typeof store;
export type ClientState = InferState<ClientProducer>;
export type ClientActions = InferActions<ClientProducer>;

export const combinedSlices = {
	...clientSlices,
	...sharedSlices,
};

export const store = combineProducers(combinedSlices).applyMiddleware(receiverMiddleware());
