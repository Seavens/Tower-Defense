import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const shakeToggleSetting: SettingDefinition<SettingId.ToggleShake, SettingKind.Toggle> = {
	id: SettingId.ToggleShake,
	name: "Shake Toggle",
	desc: "Toggle the shake.",

	kind: {
		kind: SettingKind.Toggle,
		guard: t.boolean,
		default: true,
		values: [true, false],
	},
};
