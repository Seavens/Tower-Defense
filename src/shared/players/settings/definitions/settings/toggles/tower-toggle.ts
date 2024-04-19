import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const towerBBToggleSetting: SettingDefinition<SettingId.ToggleTowerBB, SettingKind.Toggle> = {
	id: SettingId.ToggleTowerBB,
	name: "Tower BB Toggle",
	desc: "Toggle the Tower BB.",

	kind: {
		kind: SettingKind.Toggle,
		guard: t.boolean,
		default: true,
		values: [true, false],
	},
};
