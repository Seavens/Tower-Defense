import { LevelUtility } from "shared/profile/utility";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { UserMetadata } from "shared/replication/metadata";
import type {
	ProfileActions,
	ProfileAddExperience,
	ProfileAdjustCoins,
	ProfileAdjustGems,
} from "shared/profile/actions";
import type { ProfileData } from "shared/data/types";

export interface ProfileState {
	readonly data: Readonly<ProfileData>;
}

interface State {
	readonly [user: string]: ProfileState;
}

const state: State = {};

export const profileSlice = createProducer<State, ProfileActions<State>>(state, {
	profileAddExperience: (state: State, payload: ProfileAddExperience, metadata: UserMetadata): State => {
		const { user } = metadata;
		const { amount } = payload;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) {
				return;
			}
			const { data } = player;
			const { level } = data;
			const [newLevel, newExperience] = LevelUtility.calculateIncrease(level, amount);
			player.data.level = newLevel;
			player.data.experience = newExperience;
		});
	},
	profileAdjustCoins: (state: State, payload: ProfileAdjustCoins, metadata: UserMetadata): State => {
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
	profileAdjustGems: (state: State, payload: ProfileAdjustGems, metadata: UserMetadata) => {
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
	dataAdded: (state: State, payload: DataAdded, metadata: UserMetadata): State => {
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
});
