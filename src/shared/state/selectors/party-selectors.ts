import type { Party } from "shared/types/objects";

import type { PartyState, SharedState } from "../slices";

export function selectPartyState(state: SharedState): PartyState {
	const { party } = state;
	return party;
}

export function selectPartyById(id: string): (state: SharedState) => Option<Party> {
	return function (state: SharedState): Option<Party> {
		const { parties } = selectPartyState(state);
		const party = parties.get(id);
		return party;
	};
}

export function selectPartyByUser(user: string): (state: SharedState) => Option<Party> {
	return function (state: SharedState): Option<Party> {
		const { parties, users } = selectPartyState(state);
		const id = users.get(user);
		if (id === undefined) {
			return undefined;
		}
		const party = parties.get(id);
		return party;
	};
}

export function isUserInParty(user: string): (state: SharedState) => boolean {
	return function (state: SharedState): boolean {
		const { users } = selectPartyState(state);
		return users.has(user);
	};
}

export function isUserPartyOwner(id: string, user: string): (state: SharedState) => boolean {
	return function (state: SharedState): boolean {
		const { parties } = selectPartyState(state);
		const party = parties.get(id);
		return party !== undefined && party.owner === user;
	};
}
