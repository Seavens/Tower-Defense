import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const musicToggleSetting: SettingDefinition<SettingId.ToggleMusic, SettingKind.Toggle> = {
	id: SettingId.ToggleMusic,
	name: "Music Toggle",
	desc: "Toggle the music.",

	kind: {
		kind: SettingKind.Toggle,
		guard: t.boolean,
		default: true,
		values: [true, false],
	},
};
