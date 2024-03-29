import { Flamework } from "@flamework/core";

export const enum GameStatus {
	Spawning = "game_status:spawning",
	Ongoing = "game_status:ongoing",
	Waiting = "game_status:waiting",
	Ended = "game_status:ended",
	None = "game_status:none",
}

export const isGameStatus = Flamework.createGuard<GameStatus>();
