import { MobAnimation } from "./types";
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

	height: 1.89 + 1,

	animations: {
		[MobAnimation.Walk]: ["rbxassetid://913402848"],
	},
};
