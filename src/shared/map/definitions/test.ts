import { MapDifficulty, MapId } from "../types";
import { MobId } from "shared/mobs/types";
import type { MapDefinition } from ".";

export const testMap: MapDefinition<MapId.Test> = {
	id: MapId.Test,
	name: "Test",
	desc: "...",
	difficulty: MapDifficulty.Easy,
	waves: [
		[
			{
				// [MobId.Zombie]: { count: 5, delay: 5, wait: 1, reward: 500 },
				[MobId.Zombie]: { count: 500, delay: 1, wait: 0.1 },
			},
			500,
		],
		[
			{
				[MobId.Zombie]: { count: 10, delay: 5, wait: 0.5 },
			},
			500,
		],
		[
			{
				[MobId.Zombie]: { count: 15, delay: 5, wait: 0.3 },
			},
			500,
		],
		[
			{
				[MobId.Zombie]: { count: 25, delay: 5, wait: 0.3 },
			},
			500,
		],
		[
			{
				[MobId.Zombie]: { count: 35, delay: 5, wait: 0.3 },
			},
			500,
		],
	],
	baseHealth: math.huge,
};
