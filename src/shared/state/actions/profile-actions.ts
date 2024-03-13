import type { DataActions } from "./data-actions";
import type { EntityMetadata, ReplicationMetadata } from "../metadata";

export type ProfileActions<S> = {
	profileAdjustLevel: (state: S, payload: ProfileAdjustLevel, metadata: EntityMetadata & ReplicationMetadata) => S;
	profileAdjustExperience: (
		state: S,
		payload: ProfileAdjustExperience,
		metadata: EntityMetadata & ReplicationMetadata,
	) => S;
	profileAdjustCoins: (state: S, payload: ProfileAdjustCoins, metadata: EntityMetadata & ReplicationMetadata) => S;
	profileAdjustGems: (state: S, payload: ProfileAdjustGems, metadata: EntityMetadata & ReplicationMetadata) => S;
	profileAdjustDailyRewards: (
		state: S,
		payload: ProfileAdjustDailyRewards,
		metadata: EntityMetadata & ReplicationMetadata,
	) => S;
} & DataActions<S>;

export interface ProfileAdjustLevel {
	level: number;
	isAdd: boolean;
}

export interface ProfileAdjustExperience {
	experience: number;
	isAdd: boolean;
}

export interface ProfileAdjustCoins {
	coins: number;
	isAdd: boolean;
}
export interface ProfileAdjustGems {
	gems: number;
	isAdd: boolean;
}

export interface ProfileAdjustDailyRewards {
	streak: number;
	date: DateTime;
}
