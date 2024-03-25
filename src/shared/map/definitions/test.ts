import { MapDifficulty, MapId } from "../types";
import { MobId } from "shared/mobs/types";
import { TowerId } from "shared/tower/types";
import type { MapDefinition } from ".";

export const testMap: MapDefinition<MapId.Test> = {
	id: MapId.Test,
	name: "Test",
	desc: "...",
	difficulty: MapDifficulty.Easy,
	waves: [
		{
			[MobId.Zombie]: { count: 20, delay: 5, wait: 0.75 },
		},
		{
			[MobId.Zombie]: { count: 40, delay: 5, wait: 0.5 },
		},
		{
			[MobId.Zombie]: { count: 80, delay: 5, wait: 0.3 },
		},
		{
			[MobId.Zombie]: { count: 160, delay: 5, wait: 0.3 },
		},
	],
	towerLimits: {
		[TowerId.Blunt]: 10,
		[TowerId.God]: 2,
		[TowerId.Melee]: 5,
		[TowerId.Sniper]: 5,
	},
	baseHealth: math.huge,
};
