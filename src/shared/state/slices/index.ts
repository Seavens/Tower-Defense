import { gameSlice } from "./game-slice";
import { partySlice } from "./party-slice";
import type { CombineStates } from "@rbxts/reflex";
import type { GameState } from "./game-slice";
import type { PartyState } from "./party-slice";

export type SharedProducers = typeof sharedSlices;
export type SharedState = CombineStates<SharedProducers>;

export const sharedSlices = {
	game: gameSlice,
	party: partySlice,
};

export type { GameState, PartyState };
