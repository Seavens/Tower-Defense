import type { BroadcastMetadata, UserMetadata } from "shared/state/replication/metadata";
import type { GameStatus } from "./types";
import type { MapId } from "./map/types";
import type { PlayerActions } from "shared/state/replication/actions";

export type GameActions<S> = {
	gameStartRound: (state: S, payload: GameStartRound, metadata: BroadcastMetadata) => S;
	gameEndRound: (state: S, payload: GameEndRound, metadata: BroadcastMetadata) => S;
	gameStartWave: (state: S, payload: GameStartWave, metadata: BroadcastMetadata) => S;
	gameEndWave: (state: S, payload: GameEndWave, metadata: BroadcastMetadata) => S;
	gameChangeMap: (state: S, payload: GameChangeMap, metadata: BroadcastMetadata) => S;
	gameSetStatus: (state: S, payload: GameSetStatus, metadata: BroadcastMetadata) => S;
	gameBaseDamage: (state: S, payload: GameBaseDamage, metadata: BroadcastMetadata) => S;
	gameAddCurrency: (state: S, payload: GameAddCurrency, metadata: UserMetadata & BroadcastMetadata) => S;
} & PlayerActions<S>;

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

export interface GameAddCurrency {
	amount: number;
}
