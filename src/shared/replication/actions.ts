import type { EntityMetadata, ReplicationMetadata } from "./metadata";

export type PlayerActions<S> = {
	playerAdded: (state: S, payload: PlayerAdded, metadata: EntityMetadata & ReplicationMetadata) => S;
	playerRemoved: (state: S, payload: PlayerRemoved, metadata: EntityMetadata & ReplicationMetadata) => S;
};

export interface PlayerAdded {}

export interface PlayerRemoved {}
