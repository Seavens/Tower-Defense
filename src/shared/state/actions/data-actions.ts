import type { Data } from "shared/types/data";
import type { EntityMetadata, ReplicationMetadata } from "../metadata";

export type DataActions<S> = {
	dataAdded: (state: S, payload: DataAdded, metadata: EntityMetadata & ReplicationMetadata) => S;
	dataRemoved: (state: S, payload: DataRemoved, metadata: EntityMetadata & ReplicationMetadata) => S;
};

export interface DataAdded {
	data: Data;
}

export interface DataRemoved {}
