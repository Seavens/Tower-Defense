import { clear } from "@rbxts/immut/src/table";
import { produce } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
//
import { PARTY_INVITE_EXPIRATION } from "./constants";
import { createProducer } from "@rbxts/reflex";
import type { UserMetadata } from "shared/state/replication/metadata";
import type { Party, PartyInvite } from "./types";
import type {
	PartyAcceptInvite,
	PartyActions,
	PartyCreate,
	PartyDisband,
	PartyInviteExpired,
	PartyInviteMember,
	PartyKickMember,
} from "./actions";
import type { PlayerAdded, PlayerRemoved } from "shared/state/replication/actions";

export interface PartyState {
	readonly parties: Map<string, Readonly<Party>>; // Map<{Party Owner}, Party>
	readonly invites: Map<string, Map<string, Readonly<PartyInvite>>>; // Map<{User}, Map<{Party Id}, Invite>>
	readonly users: Map<string, string>; // Map<{User in a party}, {Party Id}>
}

const partyState: PartyState = {
	parties: new Map<string, Party>(),
	invites: new Map<string, Map<string, PartyInvite>>(),
	users: new Map<string, string>(),
};

export const partySlice = createProducer<PartyState, PartyActions<PartyState>>(partyState, {
	createParty: (state: PartyState, { id }: PartyCreate, { user }: UserMetadata): PartyState =>
		produce(state, ({ parties, users }: Draft<PartyState>): void => {
			const owner = user;
			if (users.has(owner)) {
				return;
			}
			const members = new Set<string>([owner]);
			const party: Party = {
				id,
				members,
				owner,
			};
			parties.set(id, party);
			// Map the user to the party id for easier lookup.
			users.set(owner, id);
		}),
	disbandParty: (state: PartyState, _: PartyDisband, { user }: UserMetadata): PartyState =>
		produce(state, ({ parties, users }: Draft<PartyState>): void => {
			const owner = user;
			const id = users.get(user);
			if (id === undefined) {
				return;
			}
			const party = parties.get(id);
			if (party === undefined || party.owner !== owner) {
				return;
			}
			const { members } = party;
			for (const member of members) {
				// Remove user to id mappings.
				users.delete(member);
			}
			// Clear members.
			clear(members);
			// Delete party.
			parties.delete(id);
		}),
	inviteMember: (
		state: PartyState,
		{ invitee, timestamp }: PartyInviteMember,
		{ user }: UserMetadata,
	): PartyState =>
		produce(state, ({ parties, invites, users }: Draft<PartyState>): void => {
			const sender = user;
			const id = users.get(sender);
			// If the sender is not in a party or the invitee is in one already.
			if (id === undefined || users.has(invitee)) {
				return;
			}
			const party = parties.get(id);
			// If the party does not exist or if the sender is not the owner.
			if (party === undefined || party.owner !== sender) {
				return;
			}
			let pending = invites.get(invitee);
			if (pending === undefined) {
				pending = new Map<string, PartyInvite>();
				invites.set(invitee, pending);
			}
			const invite: PartyInvite = {
				invitee,
				// Includes timestamp so we can know if the party invite is too old to accept.
				// We're not worried about removing it since we'll have some other system do that.
				timestamp,
				sender,
				// Include the id of the party we were invited to.
				id,
			};
			// If we have an invite from the same party id, replace it with the most recent (this invite)
			pending.set(id, invite);
		}),
	kickMember: (state: PartyState, { member }: PartyKickMember, { user }: UserMetadata): PartyState =>
		produce(state, ({ parties, invites, users }: Draft<PartyState>): void => {
			const kicker = user;
			const id = users.get(kicker);
			// If the user is not in a party.
			if (id === undefined) {
				return;
			}
			const party = parties.get(id);
			if (party === undefined || party.owner !== kicker) {
				return;
			}
			const { members } = party;
			if (!members.has(member)) {
				return;
			}
			const pending = invites.get(member);
			// Remove them from the party and remove their party id mapping.
			members.delete(member);
			users.delete(member);
			// Delete any invites they have, incase they have an invite to the party they were just kicked from.
			pending?.delete(id);
		}),
	acceptInvite: (state: PartyState, { id, timestamp }: PartyAcceptInvite, { user }: UserMetadata): PartyState =>
		produce(state, ({ parties, invites, users }: Draft<PartyState>): void => {
			const invitee = user;
			// Invitee is in a party.
			if (users.has(invitee)) {
				return;
			}
			const pending = invites.get(invitee);
			const invite = pending?.get(id);
			if (pending === undefined || invite === undefined) {
				return;
			}
			// Will be deleted regardless of success/failure.
			pending.delete(id);
			// Invite expired.
			if (invite.timestamp + PARTY_INVITE_EXPIRATION <= timestamp) {
				return;
			}
			const party = parties.get(id);
			if (party === undefined) {
				return;
			}
			const { members } = party;
			// Join the party.
			members.add(invitee);
			// Map the user to the party they're now in.
			users.set(invitee, id);
		}),
	// Internal use only.
	inviteExpired: (state: PartyState, { id }: PartyInviteExpired, { user }: UserMetadata): PartyState =>
		produce(state, ({ invites }: Draft<PartyState>): void => {
			const pending = invites.get(user);
			if (pending === undefined) {
				return;
			}
			pending.delete(id);
		}),
	playerAdded: (state: PartyState, _1: PlayerAdded, _2: UserMetadata): PartyState => {
		return state;
	},
	playerRemoved: (state: PartyState, _: PlayerRemoved, { user }: UserMetadata): PartyState =>
		produce(state, ({ parties, invites, users }: Draft<PartyState>): void => {
			const id = users.get(user);
			invites.delete(user);
			users.delete(user);
			if (id === undefined) {
				return;
			}
			const party = parties.get(id);
			if (party === undefined) {
				return;
			}
			const { members, owner } = party;
			if (owner === user) {
				// If they're the owner, disband the party.
				for (const member of members) {
					// Remove user to id mappings.
					users.delete(member);
				}
				// Clear members.
				clear(members);
				// Delete party.
				parties.delete(id);
			}
			// Remove user from party (already done if they were the owner.)
			members.delete(user);
		}),
});
