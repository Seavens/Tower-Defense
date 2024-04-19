import { DATA_TEMPLATE } from "shared/players/data/constants";
import { SettingKind, settingDefinitions } from "shared/players/settings";
import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { DataAdded } from "shared/players/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ExcludeMetadata } from "shared/state/replication/metadata";
import type { SettingActions, SettingId, SettingReset, SettingSet, Settings } from "shared/players/settings";

export interface SettingState {
	taken: Set<Keycode>;
	data: Settings;
}

const settingState: SettingState = {
	taken: new Set<Keycode>(),
	data: DATA_TEMPLATE.settings,
};

export const settingSlice = createProducer<SettingState, ExcludeMetadata<SettingActions<SettingState>>>(settingState, {
	dataAdded: (state: SettingState, { data }: DataAdded): SettingState => {
		const { settings } = data;
		return {
			data: settings,
			taken: new Set<Keycode>(),
		};
	},
	dataRemoved: (state: SettingState, _): SettingState =>
		produce(state, (draft: Draft<SettingState>): void => {
			clear(draft);
		}),
	setSetting: <I extends SettingId>(state: SettingState, { id, value }: SettingSet<I>): SettingState =>
		produce(state, (draft: Draft<SettingState>): void => {
			const { data, taken } = draft;
			const { values } = data;
			const { kind: definition } = settingDefinitions[id];
			const { kind, guard } = definition;
			if (!guard(value)) {
				warn(id, value);
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
	resetSetting: (state: SettingState, { id }: SettingReset): SettingState =>
		produce(state, (draft: Draft<SettingState>): void => {
			const { data, taken } = draft;
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
