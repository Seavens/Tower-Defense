import { DATA_TEMPLATE } from "shared/players/data/constants";
import { Events } from "client/network";
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
			if (setting === ProfileSetting.Music && typeIs(value, "boolean")) {
				settings.audio.music = value;
				Events.profile.adjustSetting(ProfileSetting.Music, value);
			}
			if (setting === ProfileSetting.MusicVol && typeIs(value, "number")) {
				settings.audio.musicVol = value;
				Events.profile.adjustSetting(ProfileSetting.MusicVol, value);
			}
			if (setting === ProfileSetting.Sfx && typeIs(value, "boolean")) {
				settings.audio.sfx = value;
				Events.profile.adjustSetting(ProfileSetting.Sfx, value);
			}
			if (setting === ProfileSetting.SfxVol && typeIs(value, "number")) {
				settings.audio.sfxVol = value;
				Events.profile.adjustSetting(ProfileSetting.SfxVol, value);
			}
			if (setting === ProfileSetting.Vfx && typeIs(value, "boolean")) {
				settings.visual.vfx = value;
				Events.profile.adjustSetting(ProfileSetting.Vfx, value);
			}
			if (setting === ProfileSetting.Shake && typeIs(value, "boolean")) {
				settings.visual.shake = value;
				Events.profile.adjustSetting(ProfileSetting.Shake, value);
			}
			if (setting === ProfileSetting.MobBB && typeIs(value, "boolean")) {
				settings.visual.mobBB = value;
				Events.profile.adjustSetting(ProfileSetting.MobBB, value);
			}
			if (setting === ProfileSetting.TowerBB && typeIs(value, "boolean")) {
				settings.visual.towerBB = value;
				Events.profile.adjustSetting(ProfileSetting.TowerBB, value);
			}
			warn(`[Slice] Setting ${setting} to ${value}`);
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
