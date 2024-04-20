import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const uiVolumeSetting: SettingDefinition<SettingId.UIVolume, SettingKind.Slider> = {
	id: SettingId.UIVolume,
	name: "UI Volume",
	desc: "Adjust the volume of the UI.",

	kind: {
		kind: SettingKind.Slider,
		guard: t.numberConstrained(0, 100),
		max: 100,
		min: 0,
		default: 100,
	},
};
