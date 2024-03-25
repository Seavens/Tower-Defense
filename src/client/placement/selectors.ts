import type { ClientState } from "client/state/store";
import type { PlacementState } from "./slice";

export function selectPlacementState(state: ClientState): PlacementState {
	const { placement } = state;
	return placement;
}

export function selectPlacing(state: ClientState): Option<string> {
	const { placing } = selectPlacementState(state);
	return placing;
}

export function isPlacing(state: ClientState): boolean {
	const { placing } = selectPlacementState(state);
	return placing !== undefined;
}
