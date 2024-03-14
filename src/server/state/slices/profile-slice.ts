import { LevelFunctions } from "shared/functions/level-functions";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type {
	DataAdded,
	DataRemoved,
	ProfileActions,
	ProfileAdjustCoins,
	ProfileAdjustDailyRewards,
	ProfileAdjustExperience,
	ProfileAdjustGems,
	ProfileAdjustLevel,
} from "shared/state/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata, ReplicationMetadata } from "shared/state/metadata";
import type { ProfileData } from "shared/types/data";

export interface ProfileState {
	data: ProfileData;
}

interface State {
	[user: string]: ProfileState;
}

const state: State = {};

export const profileSlice = createProducer<State, ProfileActions<State>>(state, {
	profileAdjustLevel: (state: State, payload: ProfileAdjustLevel, metadata: EntityMetadata): State => {
		const { user } = metadata;
		const { level, isAdd } = payload;
		if (isAdd) {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				player.data.level = level;
			});
		} else {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				player.data.level -= level;
			});
		}
	},
	profileAdjustExperience: (
		state: State,
		payload: ProfileAdjustExperience,
		metadata: EntityMetadata & ReplicationMetadata,
	): State => {
		const { user } = metadata;
		const { experience, isAdd } = payload;
		if (isAdd) {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				LevelFunctions.levelUp(player.data.level, experience);
			});
		} else {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				LevelFunctions.levelDown(player.data.level, experience);
			});
		}
	},
	profileAdjustCoins: (
		state: State,
		payload: ProfileAdjustCoins,
		metadata: EntityMetadata & ReplicationMetadata,
	): State => {
		const { user } = metadata;
		const { coins, isAdd } = payload;
		if (isAdd) {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				player.data.coins += coins;
			});
		} else {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				player.data.coins -= coins;
			});
		}
	},
	profileAdjustGems: (state: State, payload: ProfileAdjustGems, metadata: EntityMetadata & ReplicationMetadata) => {
		const { user } = metadata;
		const { gems, isAdd } = payload;
		if (isAdd) {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				player.data.gems += gems;
			});
		} else {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				player.data.gems -= gems;
			});
		}
	},
	dataAdded: (state: State, payload: DataAdded, metadata: EntityMetadata): State => {
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
	dataRemoved: (state: State, payload: DataRemoved, metadata: EntityMetadata): State => {
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			delete draft[user];
		});
	},
});
