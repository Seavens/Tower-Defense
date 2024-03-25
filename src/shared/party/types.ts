import { Flamework } from "@flamework/core";

export interface PartyInvite {
	invitee: string;
	timestamp: number;
	sender: string;
	id: string;
}

export interface Party {
	id: string;
	owner: string;
	members: Set<string>;
}

export const isParty = Flamework.createGuard<Party>();
export const isPartyInvite = Flamework.createGuard<PartyInvite>();
