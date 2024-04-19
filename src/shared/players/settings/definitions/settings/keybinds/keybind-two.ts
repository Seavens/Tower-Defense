import { SettingId, SettingKind } from "shared/players/settings";
import { isKeycode } from "shared/utility/guards/keycode";
import type { SettingDefinition } from "..";

export const toggleSlotTwoSetting: SettingDefinition<SettingId.SlotTwo, SettingKind.Keybind> = {
	id: SettingId.SlotTwo,
	name: "Toggle Slot 2",
	desc: "Toggle the second slot.",

	kind: {
		kind: SettingKind.Keybind,
		guard: isKeycode,
		default: "Two",
	},
};
