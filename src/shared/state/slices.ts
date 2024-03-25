import { gameSlice } from "shared/game/slice";
import { partySlice } from "shared/party/slice";
import { towerSlice } from "shared/tower/slice";
import type { CombineStates } from "@rbxts/reflex";
import type { GameState } from "shared/game/slice";
import type { PartyState } from "shared/party/slice";
import type { TowerState } from "shared/tower/slice";

export type SharedSlices = typeof sharedSlices;
export type SharedState = CombineStates<SharedSlices>;

export const sharedSlices = {
	game: gameSlice,
	party: partySlice,
	tower: towerSlice,
} as const;

export type { GameState, PartyState, TowerState };
