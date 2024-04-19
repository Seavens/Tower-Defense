import { type ProfileSetting } from "./types";
import type { DataActions } from "shared/players/data/actions";
import type { KeybindSetting } from "./types";
import type { ReplicationMetadata, UserMetadata } from "shared/state/replication/metadata";

export type ProfileActions<S> = {
	profileAddExperience: (state: S, payload: ProfileAddExperience, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustGems: (state: S, payload: ProfileAddGems, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustCoins: (state: S, payload: ProfileAddCoins, metadata: UserMetadata & ReplicationMetadata) => S;
	profileAdjustSetting: (state: S, payload: ProfileAdjustSetting, metadata: UserMetadata & ReplicationMetadata) => S;
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
export interface ProfileAdjustSetting {
	setting: ProfileSetting | KeybindSetting;
	value: boolean | number | Enum.KeyCode;
}
