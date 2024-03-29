import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";

import { calculateIncrease } from "shared/profile/utility";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata } from "shared/replication/metadata";
import type {
	ProfileActions,
	ProfileAddExperience,
	ProfileAdjustCoins,
	ProfileAdjustGems,
} from "shared/profile/actions";
import type { ProfileData } from "shared/data/types";

export interface ProfileState {
	data: ProfileData;
}

interface State {
	[user: string]: ProfileState;
}

const state: State = {};

export const profileSlice = createProducer<State, ProfileActions<State>>(state, {
	profileAddExperience: (state: State, payload: ProfileAddExperience, metadata: EntityMetadata): State => {
		const { user } = metadata;
		const { experience } = payload;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) {
				warn(user);
				return;
			}
			const [level, leftover] = calculateIncrease(player.data.level, experience);
			player.data.level = level;
			player.data.experience = leftover;
		});
	},
	profileAdjustCoins: (state: State, payload: ProfileAdjustCoins, metadata: EntityMetadata): State => {
		const { user } = metadata;
		const { coins } = payload;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) {
				return;
			}
			const { data } = player;
			data.coins = math.max(data.coins + coins, 0);
		});
	},
	profileAdjustGems: (state: State, payload: ProfileAdjustGems, metadata: EntityMetadata) => {
		const { user } = metadata;
		const { gems } = payload;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) {
				return;
			}
			const { data } = player;
			data.gems = math.max(data.gems + gems, 0);
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
