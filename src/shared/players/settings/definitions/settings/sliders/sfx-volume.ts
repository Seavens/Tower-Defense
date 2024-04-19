import { SettingId, SettingKind } from "shared/players/settings";
import { t } from "@rbxts/t";
import type { SettingDefinition } from "..";

export const sfxVolumeSetting: SettingDefinition<SettingId.SfxVolume, SettingKind.Slider> = {
	id: SettingId.SfxVolume,
	name: "Music Volume",
	desc: "Adjust the volume of the music.",

	kind: {
		kind: SettingKind.Slider,
		guard: t.numberConstrained(0, 100),
		max: 100,
		min: 0,
		default: 100,
	},
};
