import type { BroadcastMetadata } from "../metadata";
import type { GameStatus } from "shared/types/enums";
import type { MapId } from "shared/types/ids";

export type GameActions<S> = {
	gameStartRound: (state: S, payload: GameStartRound, metadata: BroadcastMetadata) => S;
	gameEndRound: (state: S, payload: GameEndRound, metadata: BroadcastMetadata) => S;
	gameStartWave: (state: S, payload: GameStartWave, metadata: BroadcastMetadata) => S;
	gameEndWave: (state: S, payload: GameEndWave, metadata: BroadcastMetadata) => S;
	gameChangeMap: (state: S, payload: GameChangeMap, metadata: BroadcastMetadata) => S;
	gameSetStatus: (state: S, payload: GameSetStatus, metadata: BroadcastMetadata) => S;
	gameBaseDamage: (state: S, payload: GameBaseDamage, metadata: BroadcastMetadata) => S;
};

export interface GameStartRound {
	health: number;
}

export interface GameEndRound {}

export interface GameStartWave {}

export interface GameEndWave {}

export interface GameChangeMap {
	map: MapId;
}

// Unsafe, not recommended.
export interface GameSetStatus {
	status: GameStatus;
}

export interface GameBaseDamage {
	damage: number;
}