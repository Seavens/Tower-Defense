import type { DataActions } from "shared/players/data/actions";
import type { ReplicationMetadata, UserMetadata } from "shared/state/replication/metadata";

export type ProfileActions<S> = {
	profileAddExperience: (state: S, payload: ProfileAddExperience, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustGems: (state: S, payload: ProfileAddGems, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustCoins: (state: S, payload: ProfileAddCoins, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustMusic: (state: S, payload: ProfileAdjustMusic, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustSfx: (state: S, payload: ProfileAdjustSfx, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustVfx: (state: S, payload: ProfileAdjustVfx, metadata: UserMetadata & ReplicationMetadata) => S;
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
export interface ProfileAdjustMusic {
	musicEnabled?: boolean;
	volume?: number;
}
export interface ProfileAdjustSfx {
	sfxEnabled?: boolean;
	volume?: number;
}
export interface ProfileAdjustVfx {
	vfxEnabled?: boolean;
	mobBillboards?: boolean;
	towerBillboards?: boolean;
}
