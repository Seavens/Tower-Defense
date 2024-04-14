import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const ratMob: MobDefinition<MobId.Rat> = {
	id: MobId.Rat,
	name: "Rat",
	desc: "...",

	speed: 8,
	resistances: [],
	health: 100,

	bounty: 75,
	experience: 15,

	height: 2.8,

	animations: {
		[MobAnimation.Walk]: ["rbxassetid://913402848"],
	},
};
