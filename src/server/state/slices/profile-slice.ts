import { LevelFunctions } from "shared/functions/level-functions";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded, DataRemoved, ProfileActions } from "shared/state/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata, ReplicationMetadata } from "shared/state/metadata";
import type { ProfileData } from "shared/types/data";

export interface ProfileState {
	data: ProfileData;
}

interface State {
	[user: string]: ProfileState;
}

const state: State = {};

export const profileSlice = createProducer<State, ProfileActions<State>>(state, {
	profileAddExperience: (state: State, payload: number, metadata: EntityMetadata & ReplicationMetadata): State => {
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) {
				return;
			}
			LevelFunctions.levelUp(player.data.level, player.data.experience);
		});
	},
	profileAddCoins: (state: State, payload: number, metadata: EntityMetadata & ReplicationMetadata): State => {
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) {
				return;
			}
			player.data.coins += payload;
		});
	},
	profileRemoveCoins: (state: State, payload: number, metadata: EntityMetadata & ReplicationMetadata): State => {
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) {
				return;
			}
			player.data.coins -= payload;
		});
	},
	dataAdded: (state: State, payload: DataAdded, metadata: EntityMetadata): State => {
		const { data } = payload;
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			const { profile } = data;
			const state: ProfileState = {
				data: profile,
			};
			draft[user] = state;
		});
	},
	dataRemoved: (state: State, payload: DataRemoved, metadata: EntityMetadata): State => {
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			delete draft[user];
		});
	},
});
