import { MapDifficulty, MapId } from "../types";
import { MobId } from "shared/mob/types";
import type { MapDefinition } from ".";

export const testMap: MapDefinition<MapId.Test> = {
	id: MapId.Test,
	name: "Test",
	desc: "...",
	difficulty: MapDifficulty.Easy,
	waves: [
		[{ [MobId.Rat]: { count: 10, delay: 3, wait: 1.7 } }, 1000, 100],
		[
			{ [MobId.Rat]: { count: 15, delay: 3, wait: 1.6 }, [MobId.Alien]: { count: 5, delay: 3, wait: 1.6 } },
			1200,
			200,
		],
		[
			{
				[MobId.Rat]: { count: 20, delay: 3, wait: 1.5 },
				[MobId.Alien]: { count: 10, delay: 3, wait: 1.5 },
				[MobId.Monkey]: { count: 5, delay: 3, wait: 1.5 },
			},
			1400,
			300,
		],
		[
			{
				[MobId.Rat]: { count: 25, delay: 2.9, wait: 1.4 },
				[MobId.Alien]: { count: 15, delay: 2.9, wait: 1.4 },
				[MobId.Monkey]: { count: 10, delay: 2.9, wait: 1.4 },
			},
			1600,
			400,
		],
		[
			{
				[MobId.Rat]: { count: 30, delay: 2.8, wait: 1.3 },
				[MobId.Alien]: { count: 20, delay: 2.8, wait: 1.3 },
				[MobId.Monkey]: { count: 15, delay: 2.8, wait: 1.3 },
			},
			1800,
			500,
		],
		[
			{
				[MobId.Rat]: { count: 35, delay: 2.7, wait: 1.2 },
				[MobId.Alien]: { count: 25, delay: 2.7, wait: 1.2 },
				[MobId.Monkey]: { count: 20, delay: 2.7, wait: 1.2 },
			},
			2000,
			600,
		],
		[
			{
				[MobId.Rat]: { count: 40, delay: 2.6, wait: 1.1 },
				[MobId.Alien]: { count: 30, delay: 2.6, wait: 1.1 },
				[MobId.Monkey]: { count: 25, delay: 2.6, wait: 1.1 },
			},
			2200,
			700,
		],
		[
			{
				[MobId.Rat]: { count: 45, delay: 2.5, wait: 1.0 },
				[MobId.Alien]: { count: 35, delay: 2.5, wait: 1.0 },
				[MobId.Monkey]: { count: 30, delay: 2.5, wait: 1.0 },
			},
			2400,
			800,
		],
		[
			{
				[MobId.Rat]: { count: 50, delay: 2.4, wait: 0.9 },
				[MobId.Alien]: { count: 40, delay: 2.4, wait: 0.9 },
				[MobId.Monkey]: { count: 35, delay: 2.4, wait: 0.9 },
			},
			2600,
			900,
		],
		[
			{
				[MobId.Rat]: { count: 55, delay: 2.3, wait: 0.8 },
				[MobId.Alien]: { count: 45, delay: 2.3, wait: 0.8 },
				[MobId.Monkey]: { count: 40, delay: 2.3, wait: 0.8 },
			},
			2800,
			1000,
		],
		[
			{
				[MobId.Rat]: { count: 60, delay: 2.2, wait: 0.7 },
				[MobId.Alien]: { count: 50, delay: 2.2, wait: 0.7 },
				[MobId.Monkey]: { count: 45, delay: 2.2, wait: 0.7 },
			},
			3000,
			1100,
		],
		[
			{
				[MobId.Rat]: { count: 65, delay: 2.1, wait: 0.6 },
				[MobId.Alien]: { count: 55, delay: 2.1, wait: 0.6 },
				[MobId.Monkey]: { count: 50, delay: 2.1, wait: 0.6 },
			},
			3200,
			1200,
		],
		[
			{
				[MobId.Rat]: { count: 70, delay: 2.0, wait: 0.5 },
				[MobId.Alien]: { count: 60, delay: 2.0, wait: 0.5 },
				[MobId.Monkey]: { count: 55, delay: 2.0, wait: 0.5 },
			},
			3400,
			1300,
		],
		[
			{
				[MobId.Rat]: { count: 75, delay: 1.9, wait: 0.4 },
				[MobId.Alien]: { count: 65, delay: 1.9, wait: 0.4 },
				[MobId.Monkey]: { count: 60, delay: 1.9, wait: 0.4 },
			},
			3600,
			1400,
		],
		[
			{
				[MobId.Rat]: { count: 80, delay: 1.8, wait: 0.3 },
				[MobId.Alien]: { count: 70, delay: 1.8, wait: 0.3 },
				[MobId.Monkey]: { count: 65, delay: 1.8, wait: 0.3 },
			},
			3800,
			1500,
		],
	],
	baseHealth: 1000,
};
