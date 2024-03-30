import type { ClientState } from "client/state/store";

export function selectSelectedTower(state: ClientState): Option<string> {
	const { tower_ui } = state;
	const { key } = tower_ui;
	return key;
}
