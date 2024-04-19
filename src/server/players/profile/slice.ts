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
