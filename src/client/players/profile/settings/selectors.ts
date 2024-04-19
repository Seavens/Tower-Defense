import type { ClientState } from "client/state/store";
import type { SettingId, SettingValueOfId } from "shared/players/settings";
import type { SettingState } from "./slice";

export function selectSettingState(state: ClientState): SettingState {
	const { setting } = state;
	return setting;
}

export function selectSettingValues(state: ClientState): Map<SettingId, SettingValueOfId<SettingId>> {
	const { data } = selectSettingState(state);
	const { values } = data;
	return values;
}
