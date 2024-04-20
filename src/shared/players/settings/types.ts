import { Flamework } from "@flamework/core";
import { isKeycode } from "shared/utility/guards/keycode";
import { t } from "@rbxts/t";
import type { SettingValueOfId } from "./definitions";

export const enum SettingId {
	MusicVolume = "setting_id:music_volume",
	SfxVolume = "setting_id:sfx_volume",
	UIVolume = "setting_id:ui_volume",

	SlotOne = "keybind_id:slot_one",
	SlotTwo = "keybind_id:slot_two",
	SlotThree = "keybind_id:slot_three",
	SlotFour = "keybind_id:slot_four",
	SlotFive = "keybind_id:slot_five",
	SlotSix = "keybind_id:slot_six",

	ToggleInventory = "setting_id:inventory_toggle",
	ToggleSettings = "setting_id:settings_toggle",
	ToggleMusic = "setting_id:music_toggle",
	ToggleSfx = "setting_id:sfx_toggle",
	ToggleUISound = "setting_id:ui_sound_toggle",
	ToggleVfx = "setting_id:vfx_toggle",
	ToggleShake = "setting_id:shake_toggle",
	ToggleMobBB = "setting_id:mob_bb_toggle",
	ToggleTowerBB = "setting_id:tower_bb_toggle",
}

export const enum SettingKind {
	Keybind = "setting_kind:keybind",
	Slider = "setting_kind:slider",
	Toggle = "setting_kind:toggle",
}

export interface Settings {
	values: Map<SettingId, SettingValueOfId<SettingId>>;
}

export const isSettingId = Flamework.createGuard<SettingId>();
export const isSettingKind = Flamework.createGuard<SettingKind>();

export const isSettings: t.check<Settings> = t.strictInterface({
	values: t.map(isSettingId, t.union(t.number, t.boolean, isKeycode)),
});
