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

export type ExcludeMetadata<T> = {
	[K in keyof T]: Parameters<T[K]> extends [...infer U, BroadcastMetadata | EntityMetadata | ReplicationMetadata]
		? (...args: U) => ReturnType<T[K]>
		: T[K];
};

export const isBroadcastMetadata = Flamework.createGuard<BroadcastMetadata>();
export const isEntityMetadata = Flamework.createGuard<EntityMetadata>();
export const isReplicationMetadata = Flamework.createGuard<ReplicationMetadata>();
