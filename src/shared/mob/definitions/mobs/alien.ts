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
	experience: 50,

	height: 3.7,

	animations: {
		[MobAnimation.Walk]: ["rbxassetid://913402848"],
	},
};
