import type { DataActions } from "./data-actions";
import type { EntityMetadata, ReplicationMetadata } from "../metadata";

export type ProfileActions<S> = {
	profileAddExperience: (state: S, payload: number, metadata: EntityMetadata & ReplicationMetadata) => S;
	profileAddCoins: (state: S, payload: number, metadata: EntityMetadata & ReplicationMetadata) => S;
	profileRemoveCoins: (state: S, payload: number, metadata: EntityMetadata & ReplicationMetadata) => S;
	profileAddGems: (state: S, payload: number, metadata: EntityMetadata & ReplicationMetadata) => S;
	profileRemoveGems: (state: S, payload: number, metadata: EntityMetadata & ReplicationMetadata) => S;
} & DataActions<S>;

export interface ProfileAddExperience {
	experience: number;
}

export interface ProfileAddCoins {
	coins: number;
}

export interface ProfileRemoveCoins {
	coins: number;
}

export interface ProfileAddGems {
	gems: number;
}

export interface ProfileRemoveGems {
	gems: number;
}
