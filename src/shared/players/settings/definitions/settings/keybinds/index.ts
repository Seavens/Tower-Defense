import { SettingId } from "shared/players/settings";
import { toggleInventorySetting } from "./toggle-inventory";
import { toggleSettingsSetting } from "./toggle-settings";
import { toggleSlotFiveSetting } from "./keybind-five";
import { toggleSlotFourSetting } from "./keybind-four";
import { toggleSlotOneSetting } from "./keybind-one";
import { toggleSlotSixSetting } from "./keybind-six";
import { toggleSlotThreeSetting } from "./keybind-three";
import { toggleSlotTwoSetting } from "./keybind-two";

export const keybinds = {
	[SettingId.ToggleInventory]: toggleInventorySetting,
	[SettingId.ToggleSettings]: toggleSettingsSetting,

	[SettingId.SlotOne]: toggleSlotOneSetting,
	[SettingId.SlotTwo]: toggleSlotTwoSetting,
	[SettingId.SlotThree]: toggleSlotThreeSetting,
	[SettingId.SlotFour]: toggleSlotFourSetting,
	[SettingId.SlotFive]: toggleSlotFiveSetting,
	[SettingId.SlotSix]: toggleSlotSixSetting,
} as const;
