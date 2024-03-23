import type { EntityMetadata } from "../metadata";
import type { PlayerActions } from "./player-actions";

export type PartyActions<S> = {
	createParty: (state: S, payload: PartyCreate, metadata: EntityMetadata) => S;
	disbandParty: (state: S, payload: PartyDisband, metadata: EntityMetadata) => S;
	inviteMember: (state: S, payload: PartyInviteMember, metadata: EntityMetadata) => S;
	kickMember: (state: S, payload: PartyKickMember, metadata: EntityMetadata) => S;
	acceptInvite: (state: S, payload: PartyAcceptInvite, metadata: EntityMetadata) => S;
	// Internal use only.
	inviteExpired: (state: S, payload: PartyInviteExpired, metadata: EntityMetadata) => S;
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
