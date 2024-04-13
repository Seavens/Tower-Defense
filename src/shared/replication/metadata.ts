import { Flamework } from "@flamework/core";

export interface BroadcastMetadata {
	broadcast: boolean;
}

export interface UserMetadata {
	user: string;
}

export interface ReplicationMetadata {
	replicate: boolean;
}

export type ExcludeMetadata<T> = {
	[K in keyof T]: Parameters<T[K]> extends [...infer U, BroadcastMetadata | UserMetadata | ReplicationMetadata]
		? (...args: U) => ReturnType<T[K]>
		: T[K];
};

export const isBroadcastMetadata = Flamework.createGuard<BroadcastMetadata>();
export const isUserMetadata = Flamework.createGuard<UserMetadata>();
export const isReplicationMetadata = Flamework.createGuard<ReplicationMetadata>();
