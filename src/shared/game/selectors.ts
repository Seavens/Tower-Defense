import type { GameState } from "./slice";
import type { GameStatus } from "./types";
import type { MapId } from "shared/map/types";
import type { SharedState } from "shared/state/slices";

export function selectGameData(state: SharedState): GameState {
	const gameState = state.game;
	return gameState;
}

export function selectGameStatus(state: SharedState): GameStatus {
	const { status } = selectGameData(state);
	return status;
}

export function selectCurrentMap(state: SharedState): Option<MapId> {
	const { map } = selectGameData(state);
	return map;
}

export function selectCurrentWave(state: SharedState): number {
	const { wave } = selectGameData(state);
	return wave;
}

export function selectCurrency(user: string): (state: SharedState) => number {
	return function (state: SharedState): number {
		const { currency } = selectGameData(state);
		return currency.get(user) ?? 0;
	};
}
