import type { DataActions } from "shared/data/actions";
import type { ReplicationMetadata, UserMetadata } from "shared/replication/metadata";

export type ProfileActions<S> = {
	profileAddExperience: (state: S, payload: ProfileAddExperience, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustGems: (state: S, payload: ProfileAdjustGems, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustCoins: (state: S, payload: ProfileAdjustCoins, metadata: UserMetadata & ReplicationMetadata) => S;
} & DataActions<S>;

export interface ProfileAddExperience {
	amount: number;
}
export interface ProfileAdjustCoins {
	coins: number;
}
export interface ProfileAdjustGems {
	gems: number;
}
