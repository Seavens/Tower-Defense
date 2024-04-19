import { DATA_TEMPLATE } from "shared/players/data/constants";
import type { ServerState } from "server/state/store";
import type { SettingPlayerState, SettingState } from "./slice";

const fallback: SettingPlayerState = {
	data: DATA_TEMPLATE.settings,
	taken: new Set<Keycode>(),
};

export function selectSettingState(state: ServerState): SettingState {
	const { data } = state;
	const { setting } = data;
	return setting;
}

export function selectSettingByUser(user: string): (state: ServerState) => SettingPlayerState {
	return function (state: ServerState): SettingPlayerState {
		const settings = selectSettingState(state);
		return settings[user] ?? fallback;
	};
}
