import type { Data } from "shared/players/data/types";
import type { ReplicationMetadata, UserMetadata } from "shared/state/replication/metadata";

export type DataActions<S> = {
	dataAdded: (state: S, payload: DataAdded, metadata: UserMetadata & ReplicationMetadata) => S;
	dataRemoved: (state: S, payload: DataRemoved, metadata: UserMetadata & ReplicationMetadata) => S;
};

export interface DataAdded {
	data: Data;
}

export interface DataRemoved {}
