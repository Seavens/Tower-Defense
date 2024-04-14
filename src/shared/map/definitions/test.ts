import { MapDifficulty, MapId } from "../types";
import { MobId } from "shared/mob/types";
import type { MapDefinition } from ".";

export const testMap: MapDefinition<MapId.Test> = {
	id: MapId.Test,
	name: "Test",
	desc: "...",
	difficulty: MapDifficulty.Easy,

	waves: {
		first: {
			[MobId.UrbanOne]: {
				count: 12,
				delay: 0.5,
				wait: 1,
			},
		},
		appearances: {
			[MobId.UrbanOne]: 1,
			[MobId.UrbanTwo]: 4,
			[MobId.UrbanThree]: 8,
			[MobId.SoldierOne]: 11,
			[MobId.SoldierTwo]: 15,
			[MobId.SoldierThree]: 18,
			[MobId.NavyOne]: 21,
			[MobId.NavyTwo]: 25,
			[MobId.NavyThree]: 28,
			[MobId.NavyFour]: 31,
			[MobId.AirforceOne]: 35,
			[MobId.AirforceTwo]: 38,
			[MobId.AirforceThree]: 42,
			[MobId.AirforceFour]: 45,
		},
	},

	baseHealth: math.huge,
};
