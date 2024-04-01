import { DATA_TEMPLATE } from "shared/data/constants";
import { LevelUtil } from "shared/profile/utils";
import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ExcludeMetadata } from "shared/replication/metadata";
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

const state: ProfileState = {
	data: DATA_TEMPLATE.profile,
};

export const profileSlice = createProducer<ProfileState, ExcludeMetadata<ProfileActions<ProfileState>>>(state, {
	profileAddExperience: (state: ProfileState, payload: ProfileAddExperience): ProfileState => {
		const { amount } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			const [level, leftover] = LevelUtil.calculateIncrease(draft.data.level, amount);
			draft.data.level = level;
			draft.data.experience = leftover;
		});
	},
	profileAdjustCoins: (state: ProfileState, payload: ProfileAdjustCoins): ProfileState => {
		const { coins } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			draft.data.coins += coins;
		});
	},
	profileAdjustGems: (state: ProfileState, payload: ProfileAdjustGems): ProfileState => {
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
	dataRemoved: (state: ProfileState, payload: DataRemoved): ProfileState => {
		return produce(state, (draft: Draft<ProfileState>): void => {
			clear(draft);
		});
	},
});
