import type { ClientState } from "../producer";
import type { PlacementState } from "../slices";

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
