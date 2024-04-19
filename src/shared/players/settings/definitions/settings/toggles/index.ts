import { SettingId } from "shared/players/settings";
import { mobBBToggleSetting } from "./mob-toggle";
import { musicToggleSetting } from "./music-toggle";
import { sfxToggleSetting } from "./sfx-toggle";
import { shakeToggleSetting } from "./shake-toggle";
import { towerBBToggleSetting } from "./tower-toggle";
import { vfxToggleSetting } from "./vfx-toggle";

export const toggles = {
	[SettingId.ToggleMusic]: musicToggleSetting,
	[SettingId.ToggleMobBB]: mobBBToggleSetting,
	[SettingId.ToggleTowerBB]: towerBBToggleSetting,
	[SettingId.ToggleShake]: shakeToggleSetting,
	[SettingId.ToggleVfx]: vfxToggleSetting,
	[SettingId.ToggleSfx]: sfxToggleSetting,
} as const;
