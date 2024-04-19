import { DATA_TEMPLATE } from "shared/players/data/constants";
import { LevelUtility } from "shared/players/profile/utility";
import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded } from "shared/players/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ExcludeMetadata } from "shared/state/replication/metadata";
import type {
	ProfileActions,
	ProfileAddCoins,
	ProfileAddExperience,
	ProfileAddGems,
} from "shared/players/profile/actions";
import type { ProfileData } from "shared/players/data/types";

export interface ProfileState {
	readonly data: Readonly<ProfileData>;
}

const state: ProfileState = {
	data: DATA_TEMPLATE.profile,
};

export const profileSlice = createProducer<ProfileState, ExcludeMetadata<ProfileActions<ProfileState>>>(state, {
	profileAddExperience: (state: ProfileState, payload: ProfileAddExperience): ProfileState => {
		const { amount } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			const [level, leftover] = LevelUtility.calculateIncrease(draft.data.level, amount);
			draft.data.level = level;
			draft.data.experience = leftover;
		});
	},
	profileAdjustCoins: (state: ProfileState, payload: ProfileAddCoins): ProfileState => {
		const { coins } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			draft.data.coins += coins;
		});
	},
	profileAdjustGems: (state: ProfileState, payload: ProfileAddGems): ProfileState => {
		const { gems } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			draft.data.gems += gems;
		});
	},
	dataAdded: (state: ProfileState, payload: DataAdded): ProfileState => {
		const { data } = payload;
		return produce(state, (draft: Draft<ProfileState>): ProfileState => {
			const { profile } = data;
			const state: ProfileState = {
				data: profile,
			};
			return state;
		});
	},
	dataRemoved: (state: ProfileState): ProfileState => {
		return produce(state, (draft: Draft<ProfileState>): void => {
			clear(draft);
		});
	},
});
