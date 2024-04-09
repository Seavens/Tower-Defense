import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const alienMob: MobDefinition<MobId.Alien> = {
	id: MobId.Alien,
	name: "Alien",
	desc: "...",

	speed: 5,
	resistances: [],
	health: 200,

	bounty: 150,
	experience: 35,

	height: 1.43,

	animations: {
		[MobAnimation.Walk]: ["rbxassetid://913402848"],
	},
};
