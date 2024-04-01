import { GameStatus } from "./types";
import { IS_STUDIO } from "shared/core/core-constants";
import { createProducer } from "@rbxts/reflex";
import { getWaveCount } from "shared/map/utility";
import { original, produce } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata } from "shared/replication/metadata";
import type {
	GameActions,
	GameAddCurrency,
	GameBaseDamage,
	GameChangeMap,
	GameEndRound,
	GameEndWave,
	GameSetStatus,
	GameStartRound,
	GameStartWave,
} from "./actions";
import type { MapId } from "shared/map/types";
import type { PlayerAdded, PlayerRemoved } from "shared/replication/actions";

export interface GameState {
	readonly status: GameStatus;
	readonly wave: number;
	readonly map?: MapId;
	readonly health: number;
	readonly max: number;
	readonly currency: Map<string, number>;
}

const gameState: GameState = {
	status: GameStatus.None,
	wave: -1,
	map: undefined,
	health: 100,
	max: 100,
	currency: new Map<string, number>(),
};

export const gameSlice = createProducer<GameState, GameActions<GameState>>(gameState, {
	playerAdded: (state: GameState, payload: PlayerAdded, { user }: EntityMetadata): GameState => {
		return produce(state, ({ currency }: Draft<GameState>): void => {
			currency.set(user, IS_STUDIO ? 1e10 : 1000);
		});
	},
	playerRemoved: (state: GameState, payload: PlayerRemoved, { user }: EntityMetadata): GameState => {
		return produce(state, ({ currency }: Draft<GameState>): void => {
			currency.delete(user);
		});
	},
	gameStartRound: (state: GameState, payload: GameStartRound): GameState => {
		const { health } = payload;
		return produce(state, (draft: Draft<GameState>): void => {
			draft.status = GameStatus.Waiting;
			draft.wave = 0;
			draft.health = health;
			draft.max = health;
		});
	},
	gameEndRound: (state: GameState, payload: GameEndRound): GameState => {
		return produce(state, (draft: Draft<GameState>): void => {
			draft.status = GameStatus.Ended;
			draft.wave = -1;
		});
	},
	gameStartWave: (state: GameState, payload: GameStartWave): GameState => {
		return produce(state, (draft: Draft<GameState>): GameState => {
			const { map, wave, status } = draft;
			if (map === undefined || status !== GameStatus.Waiting) {
				return original(draft);
			}
			const waveCount = getWaveCount(map);
			const nextWave = math.clamp(wave + 1, 1, waveCount);
			draft.status = GameStatus.Ongoing;
			draft.wave = nextWave;
			return draft;
		});
	},
	gameEndWave: (state: GameState, payload: GameEndWave): GameState => {
		return produce(state, (draft: Draft<GameState>): GameState => {
			const { map, status } = draft;
			if (map === undefined || status !== GameStatus.Ongoing) {
				return original(draft);
			}
			draft.status = GameStatus.Waiting;
			return draft;
		});
	},
	gameChangeMap: (state: GameState, payload: GameChangeMap): GameState => {
		const { map } = payload;
		return produce(state, (draft: Draft<GameState>): GameState => {
			const { status } = draft;
			if (status !== GameStatus.None) {
				return original(draft);
			}
			draft.map = map;
			return draft;
		});
	},
	// Unsafe, not recommended.
	gameSetStatus: (state: GameState, payload: GameSetStatus): GameState => {
		const { status } = payload;
		return produce(state, (draft: Draft<GameState>): GameState => {
			draft.status = status;
			return draft;
		});
	},
	gameBaseDamage: (state: GameState, payload: GameBaseDamage): GameState => {
		const { damage } = payload;
		return produce(state, (draft: Draft<GameState>): GameState => {
			const { status, health, max } = draft;
			if (status === GameStatus.None) {
				return original(draft);
			}
			const result = math.clamp(health - damage, 0, max);
			draft.health = result;
			if (result > 0) {
				return draft;
			}
			draft.status = GameStatus.Ended;
			draft.wave = -1;
			return draft;
		});
	},
	gameAddCurrency: (state: GameState, payload: GameAddCurrency, { user }: EntityMetadata): GameState => {
		const { amount } = payload;
		return produce(state, ({ currency, status }: Draft<GameState>): void => {
			const current = currency.get(user) ?? 0;
			if (current === undefined) {
				return;
			}
			currency.set(user, current + amount);
		});
	},
});
