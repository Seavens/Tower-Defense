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
