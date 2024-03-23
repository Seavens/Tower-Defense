import type { EntityMetadata } from "../metadata";

export type PlayerActions<S> = {
	playerAdded: (state: S, payload: PlayerAdded, metadata: EntityMetadata) => S;

	playerRemoved: (state: S, payload: PlayerRemoved, metadata: EntityMetadata) => S;
};

export interface PlayerAdded {}

export interface PlayerRemoved {}
