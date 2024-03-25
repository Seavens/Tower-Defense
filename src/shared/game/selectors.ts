import type { GameState } from "./slice";
import type { GameStatus } from "./types";
import type { MapId } from "shared/map/types";
import type { SharedState } from "shared/state/slices";

export function selectGame(state: SharedState): GameState {
	const gameState = state.game;
	return gameState;
}

export function selectGameStatus(state: SharedState): GameStatus {
	const { status } = selectGame(state);
	return status;
}

export function selectCurrentMap(state: SharedState): Option<MapId> {
	const { map } = selectGame(state);
	return map;
}

export function selectCurrentWave(state: SharedState): number {
	const { wave } = selectGame(state);
	return wave;
}
