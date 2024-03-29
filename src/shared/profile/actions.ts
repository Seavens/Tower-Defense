import type { DataActions } from "shared/data/actions";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";

export type ProfileActions<S> = {
	profileAddExperience: (
		state: S,
		payload: ProfileAddExperience,
		metadata: EntityMetadata & ReplicationMetadata,
	) => S;
	profileAdjustGems: (state: S, payload: ProfileAdjustGems, metadata: EntityMetadata & ReplicationMetadata) => S;
	profileAdjustCoins: (state: S, payload: ProfileAdjustCoins, metadata: EntityMetadata & ReplicationMetadata) => S;
} & DataActions<S>;

export interface ProfileAddExperience {
	experience: number;
}

export interface ProfileAdjustCoins {
	coins: number;
	isAdd: boolean;
}
export interface ProfileAdjustGems {
	gems: number;
	isAdd: boolean;
}
