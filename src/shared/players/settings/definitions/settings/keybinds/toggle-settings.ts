import { SettingId, SettingKind } from "shared/players/settings";
import { isKeycode } from "shared/utility/guards/keycode";
import type { SettingDefinition } from "..";

export const toggleSettingsSetting: SettingDefinition<SettingId.ToggleSettings, SettingKind.Keybind> = {
	id: SettingId.ToggleSettings,
	name: "Toggle Inventory",
	desc: "Toggle the settings menu.",

	kind: {
		kind: SettingKind.Keybind,
		guard: isKeycode,
		default: "M",
	},
};
