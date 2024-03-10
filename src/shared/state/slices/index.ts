import { gameSlice } from "./game-slice";
import type { CombineStates } from "@rbxts/reflex";
import type { GameState } from "./game-slice";

export type SharedProducers = typeof sharedSlices;
export type SharedState = CombineStates<SharedProducers>;

export const sharedSlices = {
	game: gameSlice,
};

export type { GameState };
