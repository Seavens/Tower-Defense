import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const sfxToggleSetting: SettingDefinition<SettingId.ToggleSfx, SettingKind.Toggle> = {
	id: SettingId.ToggleSfx,
	name: "SFX Toggle",
	desc: "Toggle the SFX.",

	kind: {
		kind: SettingKind.Toggle,
		guard: t.boolean,
		default: true,
		values: [true, false],
	},
};
