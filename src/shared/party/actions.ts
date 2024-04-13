import type { BroadcastMetadata, UserMetadata } from "shared/replication/metadata";
import type { PlayerActions } from "shared/replication/actions";

export type PartyActions<S> = {
	createParty: (state: S, payload: PartyCreate, metadata: UserMetadata & BroadcastMetadata) => S;
	disbandParty: (state: S, payload: PartyDisband, metadata: UserMetadata & BroadcastMetadata) => S;
	inviteMember: (state: S, payload: PartyInviteMember, metadata: UserMetadata & BroadcastMetadata) => S;
	kickMember: (state: S, payload: PartyKickMember, metadata: UserMetadata & BroadcastMetadata) => S;
	acceptInvite: (state: S, payload: PartyAcceptInvite, metadata: UserMetadata & BroadcastMetadata) => S;
	// Internal use only.
	inviteExpired: (state: S, payload: PartyInviteExpired, metadata: UserMetadata & BroadcastMetadata) => S;
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
