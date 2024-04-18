import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { Status, StatusId } from "./types";
import type { StatusActions, StatusAdd, StatusRemove } from "./actions";
import type { UserMetadata } from "shared/state/replication/metadata";

export interface StatusState {
	readonly [user: string]: Map<StatusId, Status>;
}

const statusState: StatusState = {};

export const statusSlice = createProducer<StatusState, StatusActions<StatusState>>(statusState, {
	addStatus: (
		state: StatusState,
		{ id, stacks = 1, timestamp, duration }: StatusAdd,
		{ user }: UserMetadata,
	): StatusState =>
		produce(state, (draft: Draft<StatusState>): void => {
			const statuses = draft[user];
			if (statuses === undefined) {
				return;
			}
			const existing = statuses.get(id);
			if (existing !== undefined) {
				existing.stacks += 1;
				return;
			}
			const status: Status = {
				id,
				stacks,
				timestamp: timestamp + duration,
				duration,
			};
			statuses.set(id, status);
		}),
	removeStatus: (state: StatusState, { id }: StatusRemove, { user }: UserMetadata): StatusState =>
		produce(state, (draft: Draft<StatusState>): void => {
			const statuses = draft[user];
			statuses?.delete(id);
		}),
	playerAdded: (state: StatusState, _, { user }: UserMetadata): StatusState =>
		produce(state, (draft: Draft<StatusState>): void => {
			const statuses = new Map<StatusId, Status>();
			draft[user] = statuses;
		}),
	playerRemoved: (state: StatusState, _, { user }: UserMetadata): StatusState =>
		produce(state, (draft: Draft<StatusState>): void => {
			delete draft[user];
		}),
});
