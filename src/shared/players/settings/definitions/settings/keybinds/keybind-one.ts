import { SettingId, SettingKind } from "shared/players/settings";
import { isKeycode } from "shared/utility/guards/keycode";
import type { SettingDefinition } from "..";

export const toggleSlotOneSetting: SettingDefinition<SettingId.SlotOne, SettingKind.Keybind> = {
	id: SettingId.SlotOne,
	name: "Toggle Slot 1",
	desc: "Toggle the first slot.",

	kind: {
		kind: SettingKind.Keybind,
		guard: isKeycode,
		default: "One",
	},
};
