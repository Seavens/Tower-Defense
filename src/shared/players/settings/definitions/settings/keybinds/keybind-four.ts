import { SettingId, SettingKind } from "shared/players/settings";
import { isKeycode } from "shared/utility/guards/keycode";
import type { SettingDefinition } from "..";

export const toggleSlotFourSetting: SettingDefinition<SettingId.SlotFour, SettingKind.Keybind> = {
	id: SettingId.SlotFour,
	name: "Toggle Slot 4",
	desc: "Toggle the fourth slot.",

	kind: {
		kind: SettingKind.Keybind,
		guard: isKeycode,
		default: "Four",
	},
};
