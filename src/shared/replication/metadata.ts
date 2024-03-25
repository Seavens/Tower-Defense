import { Flamework } from "@flamework/core";

export interface BroadcastMetadata {
	broadcast: boolean;
}

export interface EntityMetadata {
	user: string;
}

export interface ReplicationMetadata {
	replicate: boolean;
}

export const isBroadcastMetadata = Flamework.createGuard<BroadcastMetadata>();
export const isEntityMetadata = Flamework.createGuard<EntityMetadata>();
export const isReplicationMetadata = Flamework.createGuard<ReplicationMetadata>();
