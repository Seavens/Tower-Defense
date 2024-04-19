import { SettingKind, settingDefinitions } from "shared/players/settings";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded } from "shared/players/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { SettingActions, SettingId, SettingReset, SettingSet, Settings } from "shared/players/settings";
import type { UserMetadata } from "shared/state/replication/metadata";

export interface SettingPlayerState {
	taken: Set<Keycode>;
	data: Settings;
}

export interface SettingState {
	readonly [user: string]: SettingPlayerState;
}

const settingState: SettingState = {};

export const settingSlice = createProducer<SettingState, SettingActions<SettingState>>(settingState, {
	dataAdded: (state: SettingState, { data }: DataAdded, { user }: UserMetadata): SettingState =>
		produce(state, (draft: Draft<SettingState>): void => {
			const { settings } = data;
			draft[user] = {
				data: settings,
				taken: new Set<Keycode>(),
			};
		}),
	dataRemoved: (state: SettingState, _, { user }: UserMetadata): SettingState =>
		produce(state, (draft: Draft<SettingState>): void => {
			delete draft[user];
		}),
	setSetting: <I extends SettingId>(
		state: SettingState,
		{ id, value }: SettingSet<I>,
		{ user }: UserMetadata,
	): SettingState =>
		produce(state, (draft: Draft<SettingState>): void => {
			const state = draft[user];
			if (state === undefined) {
				return;
			}
			const { data, taken } = state;
			const { values } = data;
			const { kind: definition } = settingDefinitions[id];
			const { kind, guard } = definition;
			if (!guard(value)) {
				return;
			}
			if (kind !== SettingKind.Keybind) {
				values.set(id, value);
				return;
			}
			if (taken.has(value as Keycode)) {
				return;
			}
			values.set(id, value);
			taken.add(value as Keycode);
		}),
	resetSetting: (state: SettingState, { id }: SettingReset, { user }: UserMetadata): SettingState =>
		produce(state, (draft: Draft<SettingState>): void => {
			const state = draft[user];
			if (state === undefined) {
				return;
			}
			const { data, taken } = state;
			const { values } = data;
			const { kind: definition } = settingDefinitions[id];
			const { kind, default: value } = definition;
			if (kind !== SettingKind.Keybind) {
				values.set(id, value);
				return;
			}
			if (taken.has(value)) {
				return;
			}
			values.set(id, value);
			taken.add(value);
		}),
});
