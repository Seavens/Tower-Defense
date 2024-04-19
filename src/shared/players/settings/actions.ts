import type { BroadcastMetadata, UserMetadata } from "shared/state/replication/metadata";
import type { DataActions } from "../data/actions";
import type { SettingId } from "./types";
import type { SettingValueOfId } from "./definitions";

export type SettingActions<S> = {
	setSetting: <I extends SettingId>(
		state: S,
		payload: SettingSet<I>,
		metadata: UserMetadata & BroadcastMetadata,
	) => S;
	resetSetting: (state: S, payload: SettingReset, metadata: UserMetadata & BroadcastMetadata) => S;
} & DataActions<S>;

export interface SettingSet<I extends SettingId> {
	id: I;
	value: SettingValueOfId<I>;
}

export interface SettingReset {
	id: SettingId;
}
