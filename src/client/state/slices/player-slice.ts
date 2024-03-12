import { DATA_TEMPLATE } from "shared/types/data";
import { LevelFunctions } from "shared/functions/level-functions";
import { Players } from "@rbxts/services";
import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded, DataRemoved, ProfileActions } from "shared/state/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ProfileData } from "shared/types/data";

export interface ProfileState {
	data: ProfileData;
}

const state: ProfileState = {
	data: DATA_TEMPLATE.profile,
};

export const profileSlice = createProducer<ProfileState, ProfileActions<ProfileState>>(state, {
	profileAddExperience: (state: ProfileState, payload: number): ProfileState => {
		return produce(state, (draft: Draft<ProfileState>): void => {
			LevelFunctions.levelUp(draft.data.level, payload);
		});
	},

	profileAddCoins: (state: ProfileState, payload: number): ProfileState => {
		return produce(state, (draft: Draft<ProfileState>): void => {
			draft.data.coins += payload;
		});
	},
	profileRemoveCoins: (state: ProfileState, payload: number): ProfileState => {
		return produce(state, (draft: Draft<ProfileState>): void => {
			draft.data.coins -= payload;
		});
	},
	profileAddGems: (state: ProfileState, payload: number): ProfileState => {
		return produce(state, (draft: Draft<ProfileState>): void => {
			draft.data.gems += payload;
		});
	},
	profileRemoveGems: (state: ProfileState, payload: number): ProfileState => {
		return produce(state, (draft: Draft<ProfileState>): void => {
			draft.data.gems -= payload;
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
