import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const grimaceMob: MobDefinition<MobId.Grimace> = {
	id: MobId.Grimace,
	name: "Grimace",
	desc: "...",

	speed: 3,
	resistances: [],
	health: 1000,

	bounty: 800,
	experience: 500,

	height: 4.7,

	animations: {
		[MobAnimation.Walk]: ["rbxassetid://913402848"],
	},
};
