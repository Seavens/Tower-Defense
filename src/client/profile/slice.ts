import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";

import { DATA_TEMPLATE } from "shared/data/constants";
import { levelDown, levelUp } from "shared/profile/utility";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type {
	ProfileActions,
	ProfileAdjustCoins,
	ProfileAdjustExperience,
	ProfileAdjustGems,
	ProfileAdjustLevel,
} from "shared/profile/actions";
import type { ProfileData } from "shared/data/types";

export interface ProfileState {
	data: ProfileData;
}

const state: ProfileState = {
	data: DATA_TEMPLATE.profile,
};

export const profileSlice = createProducer<ProfileState, ProfileActions<ProfileState>>(state, {
	profileAdjustLevel: (state: ProfileState, payload: ProfileAdjustLevel): ProfileState => {
		const { level, isAdd } = payload;
		if (isAdd) {
			return produce(state, (draft: Draft<ProfileState>): void => {
				levelUp(draft.data.level, level);
			});
		} else {
			return produce(state, (draft: Draft<ProfileState>): void => {
				levelDown(draft.data.level, level);
			});
		}
	},
	profileAdjustExperience: (state: ProfileState, payload: ProfileAdjustExperience): ProfileState => {
		const { experience, isAdd } = payload;
		if (isAdd) {
			return produce(state, (draft: Draft<ProfileState>): void => {
				draft.data.experience += experience;
			});
		} else {
			return produce(state, (draft: Draft<ProfileState>): void => {
				draft.data.experience -= experience;
			});
		}
	},
	profileAdjustCoins: (state: ProfileState, payload: ProfileAdjustCoins): ProfileState => {
		const { coins, isAdd } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			if (isAdd) {
				draft.data.coins += coins;
			} else {
				draft.data.coins -= coins;
			}
		});
	},
	profileAdjustGems: (state: ProfileState, payload: ProfileAdjustGems): ProfileState => {
		const { isAdd, gems } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			if (isAdd) {
				draft.data.gems += gems;
			} else {
				draft.data.gems -= gems;
			}
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
