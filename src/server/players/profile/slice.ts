import { LevelUtility } from "shared/players/profile/utility";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded } from "shared/players/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
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
	profileAdjustMusic: (state: State, payload: ProfileAdjustMusic, metadata: UserMetadata) => {
		const { user } = metadata;
		const { musicEnabled, volume } = payload;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) return;

			const { data } = player;
			const { settings } = data;

			if (musicEnabled !== undefined) settings.musicEnabled = musicEnabled;
			if (volume !== undefined) settings.musicVolume = math.clamp(volume, 0, 100);
		});
	},
	profileAdjustSfx: (state: State, payload: ProfileAdjustSfx, metadata: UserMetadata) => {
		const { user } = metadata;
		const { sfxEnabled, volume } = payload;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) return;

			const { data } = player;
			const { settings } = data;

			if (sfxEnabled !== undefined) settings.sfxEnabled = sfxEnabled;
			if (volume !== undefined) settings.sfxVolume = math.clamp(volume, 0, 100);
		});
	},
	profileAdjustVfx: (state: State, payload: ProfileAdjustVfx, metadata: UserMetadata) => {
		const { user } = metadata;
		const { vfxEnabled, mobBillboards, towerBillboards } = payload;
		return produce(state, (draft: Draft<State>): void => {
			const player = draft[user];
			if (player === undefined) return;

			const { data } = player;
			const { settings } = data;

			if (mobBillboards !== undefined) settings.mobBillboardsEnabled = mobBillboards;
			if (towerBillboards !== undefined) settings.towerBillboardsEnabled = towerBillboards;
			if (vfxEnabled !== undefined) settings.vfxEnabled = vfxEnabled;
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
