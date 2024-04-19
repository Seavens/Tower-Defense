import { type SettingValueOfId, settingDefinitions } from "./definitions";
import type { SettingId } from "./types";

const defaults = new Map<SettingId, SettingValueOfId<SettingId>>();
for (const [
	id,
	{
		kind: { default: value },
	},
] of pairs(settingDefinitions)) {
	defaults.set(id, value);
}

export const DEFAULT_SETTINGS = table.clone(defaults);
