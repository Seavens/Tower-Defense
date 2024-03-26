import { ItemId } from "shared/inventory/types";
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
		[ItemId.Blunt]: 10,
		[ItemId.God]: 2,
		[ItemId.Melee]: 5,
		[ItemId.Sniper]: 5,
	},
	baseHealth: math.huge,
};
