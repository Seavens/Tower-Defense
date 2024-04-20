import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const uiSoundToggleSetting: SettingDefinition<SettingId.ToggleUISound, SettingKind.Toggle> = {
	id: SettingId.ToggleUISound,
	name: "UI Sound Toggle",
	desc: "Toggle the UI Sounds.",

	kind: {
		kind: SettingKind.Toggle,
		guard: t.boolean,
		default: true,
		values: [true, false],
	},
};
