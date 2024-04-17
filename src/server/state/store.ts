import { broadcastMiddleware } from "server/state/replication/middleware";
import { combineProducers } from "@rbxts/reflex";
import { serverSlices } from "./slices";
import { sharedSlices } from "shared/state/slices";
import type { DataState } from "server/players/data/slice";
import type { InferActions, InferState } from "@rbxts/reflex";

export type ServerEntityState = {
	[K in keyof DataState]: DataState[K] extends { [user: string]: infer T } ? T : never;
};

export type ServerProducer = typeof store;
export type ServerState = InferState<ServerProducer>;
export type ServerActions = InferActions<ServerProducer>;

export const combinedSlices = {
	...serverSlices,
	...sharedSlices,
};

export const store = combineProducers(combinedSlices).applyMiddleware(
	broadcastMiddleware(combinedSlices, serverSlices),
);
