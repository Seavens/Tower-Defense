import { broadcastMiddleware } from "./middleware";
import { combineProducers } from "@rbxts/reflex";
import { dataSlice } from "./slices";
import { sharedSlices } from "shared/state/slices";
import type { DataState } from "./slices";
import type { InferActions, InferState } from "@rbxts/reflex";

export type ServerProducers = typeof serverSlices;
export type ServerEntityState = {
	[K in keyof DataState]: DataState[K] extends { [user: string]: infer T } ? T : never;
};

export type ServerProducer = typeof serverProducer;
export type ServerState = InferState<ServerProducer>;
export type ServerActions = InferActions<ServerProducer>;

export const serverSlices = {
	data: dataSlice,
};
export const combinedSlices = {
	...serverSlices,
	...sharedSlices,
};

export const serverProducer = combineProducers(combinedSlices).applyMiddleware(
	broadcastMiddleware(combinedSlices, serverSlices),
);
