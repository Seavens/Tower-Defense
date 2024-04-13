import type { Data } from "shared/data/types";
import type { UserMetadata, ReplicationMetadata } from "shared/replication/metadata";

export type DataActions<S> = {
	dataAdded: (state: S, payload: DataAdded, metadata: UserMetadata & ReplicationMetadata) => S;
};

export interface DataAdded {
	data: Data;
}
