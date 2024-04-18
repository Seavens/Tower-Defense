import { DATA_TEMPLATE } from "shared/players/data/constants";
import { LevelUtility } from "shared/players/profile/utility";
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
	ProfileAdjustMusic,
	ProfileAdjustSfx,
	ProfileAdjustVfx,
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
	profileAdjustMusic: (state: ProfileState, payload: ProfileAdjustMusic): ProfileState => {
		const { musicEnabled, volume } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			const { settings } = draft.data;

			if (musicEnabled !== undefined) settings.musicEnabled = musicEnabled;
			if (volume !== undefined) settings.musicVolume = math.clamp(volume, 0, 100);
		});
	},
	profileAdjustSfx: (state: ProfileState, payload: ProfileAdjustSfx): ProfileState => {
		const { sfxEnabled, volume: level } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			const { settings } = draft.data;

			if (sfxEnabled !== undefined) settings.sfxEnabled = sfxEnabled;
			if (level !== undefined) settings.sfxVolume = math.clamp(level, 0, 100);
		});
	},
	profileAdjustVfx: (state: ProfileState, payload: ProfileAdjustVfx): ProfileState => {
		const { vfxEnabled, mobBillboards, towerBillboards } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			const { settings } = draft.data;

			if (vfxEnabled !== undefined) settings.vfxEnabled = vfxEnabled;
			if (mobBillboards !== undefined) settings.mobBillboardsEnabled = mobBillboards;
			if (towerBillboards !== undefined) settings.towerBillboardsEnabled = towerBillboards;
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
});
