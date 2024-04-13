import { MapDifficulty, MapId } from "../types";
import { MobId } from "shared/mob/types";
import type { MapDefinition } from ".";

export const testMap: MapDefinition<MapId.Test> = {
	id: MapId.Test,
	name: "Test",
	desc: "...",
	difficulty: MapDifficulty.Easy,
	// waves: [[{ [MobId.Rat]: { count: 10, delay: 3, wait: 1.7 } }, 1000, 100]],

	waves: {
		first: {
			[MobId.Rat]: {
				count: 25,
				delay: 0,
				wait: 1,
			},
		},
		appearances: {
			[MobId.Rat]: 1,
			[MobId.Alien]: 7,
			[MobId.Monkey]: 12,
			[MobId.Grimace]: 15,
		},
	},

	baseHealth: 1000,
};
