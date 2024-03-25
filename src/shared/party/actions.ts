import type { BroadcastMetadata, EntityMetadata } from "shared/replication/metadata";
import type { PlayerActions } from "shared/replication/actions";

export type PartyActions<S> = {
	createParty: (state: S, payload: PartyCreate, metadata: EntityMetadata & BroadcastMetadata) => S;
	disbandParty: (state: S, payload: PartyDisband, metadata: EntityMetadata & BroadcastMetadata) => S;
	inviteMember: (state: S, payload: PartyInviteMember, metadata: EntityMetadata & BroadcastMetadata) => S;
	kickMember: (state: S, payload: PartyKickMember, metadata: EntityMetadata & BroadcastMetadata) => S;
	acceptInvite: (state: S, payload: PartyAcceptInvite, metadata: EntityMetadata & BroadcastMetadata) => S;
	// Internal use only.
	inviteExpired: (state: S, payload: PartyInviteExpired, metadata: EntityMetadata & BroadcastMetadata) => S;
} & PlayerActions<S>;

export interface PartyCreate {
	id: string;
}

export interface PartyDisband {}

export interface PartyInviteMember {
	invitee: string;
	timestamp: number;
}

export interface PartyKickMember {
	member: string;
}

export interface PartyAcceptInvite {
	id: string;
	timestamp: number;
}

export interface PartyInviteExpired {
	id: string;
}
