import { MobAnimation } from "./types";
import { MobId } from "../types";
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

	height: 1.13 + 1,

	animations: {
		[MobAnimation.Walk]: ["rbxassetid://913402848"],
	},
};
