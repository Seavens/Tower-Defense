import type { Data } from "shared/data/types";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";

export type DataActions<S> = {
	dataAdded: (state: S, payload: DataAdded, metadata: EntityMetadata & ReplicationMetadata) => S;
	dataRemoved: (state: S, payload: DataRemoved, metadata: EntityMetadata & ReplicationMetadata) => S;
};

export interface DataAdded {
	data: Data;
}

export interface DataRemoved {}
