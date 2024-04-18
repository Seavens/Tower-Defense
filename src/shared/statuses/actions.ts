import type { BroadcastMetadata, UserMetadata } from "shared/state/replication/metadata";
import type { PlayerActions } from "shared/state/replication/actions";
import type { StatusId } from "./types";

export type StatusActions<S> = {
	addStatus: (state: S, payload: StatusAdd, metadata: UserMetadata & BroadcastMetadata) => S;
	removeStatus: (state: S, payload: StatusRemove, metadata: UserMetadata & BroadcastMetadata) => S;
} & PlayerActions<S>;

export interface StatusAdd {
	id: StatusId;
	stacks?: number;
	timestamp: number;
	duration: number;
}

export interface StatusRemove {
	id: StatusId;
}
