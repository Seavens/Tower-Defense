import { LevelUtility } from "shared/players/profile/utility";
import { ProfileSetting } from "shared/players/profile/types";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded } from "shared/players/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type {
	ProfileActions,
	ProfileAddCoins,
	ProfileAddExperience,
	ProfileAddGems,
	ProfileAdjustSetting,
} from "shared/players/profile/actions";
import type { ProfileData } from "shared/players/data/types";
import type { UserMetadata } from "shared/state/replication/metadata";

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
	profileAdjustCoins: (state: State, payload: ProfileAddCoins, metadata: UserMetadata): State => {
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
	profileAdjustGems: (state: State, payload: ProfileAddGems, metadata: UserMetadata) => {
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
	profileAdjustSetting: (state: State, payload: ProfileAdjustSetting, metadata: UserMetadata) => {
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) {
				return;
			}
			const { data } = player;
			const { settings } = data;
			const { setting, value } = payload;

			if (setting === ProfileSetting.Music && typeIs(value, "boolean")) {
				settings.audio.music = value;
			}
			if (setting === ProfileSetting.MusicVol && typeIs(value, "number")) {
				settings.audio.musicVol = value;
			}
			if (setting === ProfileSetting.Sfx && typeIs(value, "boolean")) {
				settings.audio.sfx = value;
			}
			if (setting === ProfileSetting.SfxVol && typeIs(value, "number")) {
				settings.audio.sfxVol = value;
			}
			if (setting === ProfileSetting.Vfx && typeIs(value, "boolean")) {
				settings.visual.vfx = value;
			}
			if (setting === ProfileSetting.Shake && typeIs(value, "boolean")) {
				settings.visual.shake = value;
			}
			if (setting === ProfileSetting.MobBB && typeIs(value, "boolean")) {
				settings.visual.mobBB = value;
			}
			if (setting === ProfileSetting.TowerBB && typeIs(value, "boolean")) {
				settings.visual.towerBB = value;
			}
			warn(`[Slice] Setting ${setting} for ${user} to ${value}`);
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
