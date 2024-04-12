import { MapDifficulty } from "./types";

export const MAP_DIFFICULTY_MULTIPLIERS: { [D in MapDifficulty]: number } = {
	[MapDifficulty.Easy]: 0,
	[MapDifficulty.Medium]: 0.5,
	[MapDifficulty.Hard]: 1,
};
