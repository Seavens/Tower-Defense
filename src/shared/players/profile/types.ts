import { Flamework } from "@flamework/core";

export const enum KeybindSetting {
	SlotOne = "keybind_setting:slot_one",
	SlotTwo = "keybind_setting:slot_two",
	SlotThree = "keybind_setting:slot_three",
	SlotFour = "keybind_setting:slot_four",
	SlotFive = "keybind_setting:slot_five",
	SlotSix = "keybind_setting:slot_six",
}

export const enum ProfileSetting {
	MusicEnable = "profile_setting:music_enable",
	MusicVolume = "profile_setting:music_volume",
	SfxEnable = "profile_setting:sfx_enable",
	SfxVolume = "profile_setting:sfx_volume",
	VfxEnable = "profile_setting:vfx_enable",
	MobBillboardsEnable = "profile_setting:mob_billboards",
	TowerBillboardsEnable = "profile_setting:tower_billboards",
}

export const isprofileSetting = Flamework.createGuard<ProfileSetting>();
export const isKeybindSetting = Flamework.createGuard<KeybindSetting>();
