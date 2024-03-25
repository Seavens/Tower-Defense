import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";

import { levelDown, levelUp } from "shared/profile/utility";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata } from "shared/replication/metadata";
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
	profileAdjustExperience: (state: State, payload: ProfileAdjustExperience, metadata: EntityMetadata): State => {
		const { user } = metadata;
		const { experience, isAdd } = payload;
		if (isAdd) {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				levelUp(player.data.level, experience);
			});
		} else {
			return produce(state, (draft: Draft<State>): void => {
				const player = draft[user];
				if (player === undefined) {
					return;
				}
				levelDown(player.data.level, experience);
			});
		}
	},
	profileAdjustCoins: (state: State, payload: ProfileAdjustCoins, metadata: EntityMetadata): State => {
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
	profileAdjustGems: (state: State, payload: ProfileAdjustGems, metadata: EntityMetadata) => {
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
