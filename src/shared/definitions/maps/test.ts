import { MapDifficulty } from "shared/types/enums";
import { MapId, MobId } from "shared/types/ids";
import type { MapDefinition } from "shared/types/definitions";

export const testMap: MapDefinition<MapId.Test> = {
	id: MapId.Test,
	name: "Test",
	desc: "...",
	difficulty: MapDifficulty.Easy,
	waves: [
		{
			[MobId.Zombie]: { count: 500, delay: 0, wait: 1 / 20 },
		},
		{
			[MobId.Zombie]: { count: 5, delay: 2.5, wait: 1 },
		},
		{
			[MobId.Zombie]: { count: 10, delay: 0, wait: 1 },
		},
		{
			[MobId.Zombie]: { count: 10, delay: 5, wait: 1 },
		},
	],
};