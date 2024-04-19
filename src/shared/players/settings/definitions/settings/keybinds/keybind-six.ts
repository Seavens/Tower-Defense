import { SettingId, SettingKind } from "shared/players/settings";
import { isKeycode } from "shared/utility/guards/keycode";
import type { SettingDefinition } from "..";

export const toggleSlotSixSetting: SettingDefinition<SettingId.SlotSix, SettingKind.Keybind> = {
	id: SettingId.SlotSix,
	name: "Toggle Slot 6",
	desc: "Toggle the Sixth slot.",

	kind: {
		kind: SettingKind.Keybind,
		guard: isKeycode,
		default: "Six",
	},
};
