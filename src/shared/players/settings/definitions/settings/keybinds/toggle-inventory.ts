import { SettingId, SettingKind } from "shared/players/settings";
import { isKeycode } from "shared/utility/guards/keycode";
import type { SettingDefinition } from "..";

export const toggleInventorySetting: SettingDefinition<SettingId.ToggleInventory, SettingKind.Keybind> = {
	id: SettingId.ToggleInventory,
	name: "Toggle Inventory",
	desc: "Toggle the inventory menu.",

	kind: {
		kind: SettingKind.Keybind,
		guard: isKeycode,
		default: "Tab",
	},
};
