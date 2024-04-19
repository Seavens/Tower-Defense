import { SettingId } from "shared/players/settings";
import { musicVolumeSetting } from "./music-volume";
import { sfxVolumeSetting } from "./sfx-volume";

export const sliders = {
	[SettingId.MusicVolume]: musicVolumeSetting,
	[SettingId.SfxVolume]: sfxVolumeSetting,
} as const;
