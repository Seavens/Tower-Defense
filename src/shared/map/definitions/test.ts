import { MapDifficulty, MapId } from "../types";
import { MobId } from "shared/mob/types";
import type { MapDefinition } from ".";

const experience = 50;
const waveBounty = 1000;

export const testMap: MapDefinition<MapId.Test> = {
	id: MapId.Test,
	name: "Test",
	desc: "...",
	difficulty: MapDifficulty.Easy,
	waves: [
		[
			{
				[MobId.Zombie]: { count: 5, delay: 3, wait: 2 },
			},
			waveBounty,
			experience,
		],
		[
			{
				[MobId.Zombie]: { count: 10, delay: 3, wait: 1.9 },
			},
			waveBounty,
			experience,
		],
		[
			{
				[MobId.Zombie]: { count: 15, delay: 3, wait: 1.8 },
			},
			waveBounty,
			experience,
		],
		[
			{
				[MobId.Zombie]: { count: 25, delay: 3, wait: 1.7 },
			},
			waveBounty,
			experience,
		],
		[
			{
				[MobId.Zombie]: { count: 35, delay: 3, wait: 1.6 },
			},
			waveBounty,
			experience,
		],
	],
	baseHealth: math.huge,
};
