import type { GameState, SharedState } from "../slices";
import type { GameStatus } from "shared/types/enums";
import type { MapId } from "shared/types/ids";

export function selectGame(state: SharedState): GameState {
	const gameState = state.game;
	return gameState;
}

export function selectGameStatus(state: SharedState): GameStatus {
	const { status } = selectGame(state);
	return status;
}

export function selectCurrentMap(state: SharedState): MapId | undefined {
	const { map } = selectGame(state);
	return map;
}

export function selectCurrentWave(state: SharedState): number {
	const { wave } = selectGame(state);
	return wave;
}
