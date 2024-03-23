import { Flamework } from "@flamework/core";
import type { BroadcastMetadata } from "./broadcast-metadata";
import type { EntityMetadata } from "./entity-metadata";
import type { ReplicationMetadata } from "./replication-metadata";

export const isBroadcastMetadata = Flamework.createGuard<BroadcastMetadata>();
export const isEntityMetadata = Flamework.createGuard<EntityMetadata>();
export const isReplicationMetadata = Flamework.createGuard<ReplicationMetadata>();

export type { BroadcastMetadata, EntityMetadata, ReplicationMetadata };
