import { SettingId, SettingKind } from "shared/players/settings";
import { isKeycode } from "shared/utility/guards/keycode";
import type { SettingDefinition } from "..";

export const toggleSlotFiveSetting: SettingDefinition<SettingId.SlotFive, SettingKind.Keybind> = {
	id: SettingId.SlotFive,
	name: "Toggle Slot 5",
	desc: "Toggle the fith slot.",

	kind: {
		kind: SettingKind.Keybind,
		guard: isKeycode,
		default: "Five",
	},
};
