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
	Music = "profile_setting:music",
	MusicVol = "profile_setting:music_vol",
	Sfx = "profile_setting:sfx",
	SfxVol = "profile_setting:sfx_vol",
	Vfx = "profile_setting:vfx",
	Shake = "profile_setting:shake",
	MobBB = "profile_setting:mob_bb",
	TowerBB = "profile_setting:tower_bb",
}

export const isprofileSetting = Flamework.createGuard<ProfileSetting>();
export const isKeybindSetting = Flamework.createGuard<KeybindSetting>();
