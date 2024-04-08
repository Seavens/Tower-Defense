import type { ClientState } from "client/state/store";
import type { UIKind } from "./types";
import type { UIState } from "./slice";

export function selectUIState(state: ClientState): UIState {
	const { ui } = state;
	return ui;
}

export function selectOpenUI(state: ClientState): Option<UIKind> {
	const { open } = selectUIState(state);
	return open;
}
