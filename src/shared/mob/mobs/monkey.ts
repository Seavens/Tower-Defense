import { MobId } from "../types";
import type { MobDefinition } from ".";

export const monkeyMob: MobDefinition<MobId.Monkey> = {
	id: MobId.Monkey,
	name: "Monkey",
	desc: "...",

	speed: 3,
	resistances: [],
	health: 500,

	bounty: 500,
	experience: 300,

	height: 4.5,

	animations: {
		"mob_animation:Walk": ["rbxassetid://913402848"],
	},
};
