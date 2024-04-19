import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const vfxToggleSetting: SettingDefinition<SettingId.ToggleVfx, SettingKind.Toggle> = {
	id: SettingId.ToggleVfx,
	name: "VFX Toggle",
	desc: "Toggle the VFX.",

	kind: {
		kind: SettingKind.Toggle,
		guard: t.boolean,
		default: true,
		values: [true, false],
	},
};
