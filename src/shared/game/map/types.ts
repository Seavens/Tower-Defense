import { Flamework } from "@flamework/core";

export const enum MapId {
	Test = "map_id:test",
}

export const enum MapDifficulty {
	Easy = "map_difficulty:easy",
	Medium = "map_difficulty:medium",
	Hard = "map_difficulty:hard",
}

export const isMapId = Flamework.createGuard<MapId>();
export const isMapDifficulty = Flamework.createGuard<MapDifficulty>();
