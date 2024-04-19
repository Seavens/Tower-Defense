import type { DataActions } from "shared/players/data/actions";
import type { ReplicationMetadata, UserMetadata } from "shared/state/replication/metadata";

export type ProfileActions<S> = {
	profileAddExperience: (state: S, payload: ProfileAddExperience, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustGems: (state: S, payload: ProfileAddGems, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustCoins: (state: S, payload: ProfileAddCoins, metadata: UserMetadata & ReplicationMetadata) => S;
} & DataActions<S>;

export interface ProfileAddExperience {
	amount: number;
}
export interface ProfileAddCoins {
	coins: number;
}
export interface ProfileAddGems {
	gems: number;
}
