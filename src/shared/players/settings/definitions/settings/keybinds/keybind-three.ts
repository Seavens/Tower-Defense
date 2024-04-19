import { SettingId, SettingKind } from "shared/players/settings";
import { isKeycode } from "shared/utility/guards/keycode";
import type { SettingDefinition } from "..";

export const toggleSlotThreeSetting: SettingDefinition<SettingId.SlotThree, SettingKind.Keybind> = {
	id: SettingId.SlotThree,
	name: "Toggle Slot 3",
	desc: "Toggle the third slot.",

	kind: {
		kind: SettingKind.Keybind,
		guard: isKeycode,
		default: "Three",
	},
};
