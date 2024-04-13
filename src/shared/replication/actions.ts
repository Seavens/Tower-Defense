import type { ReplicationMetadata, UserMetadata } from "./metadata";

export type PlayerActions<S> = {
	playerAdded: (state: S, payload: PlayerAdded, metadata: UserMetadata & ReplicationMetadata) => S;
	playerRemoved: (state: S, payload: PlayerRemoved, metadata: UserMetadata & ReplicationMetadata) => S;
};

export interface PlayerAdded {}

export interface PlayerRemoved {}
