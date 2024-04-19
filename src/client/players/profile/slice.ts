import { DATA_TEMPLATE } from "shared/players/data/constants";
import { LevelUtility } from "shared/players/profile/utility";
import { ProfileSetting } from "shared/players/profile/types";
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
	ProfileAdjustSetting,
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
	profileAdjustSetting: (state: ProfileState, payload: ProfileAdjustSetting): ProfileState => {
		const { setting, value } = payload;
		return produce(state, (draft: Draft<ProfileState>): void => {
			const { settings } = draft.data;
			if (setting === ProfileSetting.MusicEnable && typeIs(value, "boolean")) {
				settings.musicEnabled = value;
			}
			if (setting === ProfileSetting.MusicVolume && typeIs(value, "number")) {
				settings.musicVolume = value;
			}
			if (setting === ProfileSetting.SfxEnable && typeIs(value, "boolean")) {
				settings.sfxEnabled = value;
			}
			if (setting === ProfileSetting.SfxVolume && typeIs(value, "number")) {
				settings.sfxVolume = value;
			}
			if (setting === ProfileSetting.VfxEnable && typeIs(value, "boolean")) {
				settings.vfxEnabled = value;
			}
			if (setting === ProfileSetting.MobBillboardsEnable && typeIs(value, "boolean")) {
				settings.mobBillboardsEnabled = value;
			}
			if (setting === ProfileSetting.TowerBillboardsEnable && typeIs(value, "boolean")) {
				settings.towerBillboardsEnabled = value;
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
});
