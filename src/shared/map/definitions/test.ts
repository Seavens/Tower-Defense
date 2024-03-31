import { MapDifficulty, MapId } from "../types";
import { MobId } from "shared/mobs/types";
import type { MapDefinition } from ".";

export const testMap: MapDefinition<MapId.Test> = {
	id: MapId.Test,
	name: "Test",
	desc: "...",
	difficulty: MapDifficulty.Easy,
	waves: [
		{
			[MobId.Zombie]: { count: 5, delay: 5, wait: 1 },
		},
		{
			[MobId.Zombie]: { count: 10, delay: 5, wait: 0.5 },
		},
		{
			[MobId.Zombie]: { count: 15, delay: 5, wait: 0.3 },
		},
		{
			[MobId.Zombie]: { count: 25, delay: 5, wait: 0.3 },
		},
		{
			[MobId.Zombie]: { count: 35, delay: 5, wait: 0.3 },
		},
	],
	// towerLimits: {
	// 	[ItemId.Blunt]: 15,
	// 	[ItemId.God]: 1,
	// 	[ItemId.Melee]: 1,
	// 	[ItemId.Sniper]: 1,
	// 	[ItemId.EternalDamnation]: 2,
	// },
	baseHealth: math.huge,
};
