import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const mobBBToggleSetting: SettingDefinition<SettingId.ToggleMobBB, SettingKind.Toggle> = {
	id: SettingId.ToggleMobBB,
	name: "Mob BB Toggle",
	desc: "Toggle the Mob BB.",

	kind: {
		kind: SettingKind.Toggle,
		guard: t.boolean,
		default: true,
		values: [true, false],
	},
};
