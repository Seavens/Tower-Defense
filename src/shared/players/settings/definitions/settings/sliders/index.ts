import { SettingId } from "shared/players/settings";
import { musicVolumeSetting } from "./music-volume";
import { sfxVolumeSetting } from "./sfx-volume";
import { uiVolumeSetting } from "./ui-volume";

export const sliders = {
	[SettingId.MusicVolume]: musicVolumeSetting,
	[SettingId.SfxVolume]: sfxVolumeSetting,
	[SettingId.UIVolume]: uiVolumeSetting,
} as const;
