import { MobAnimation } from "./types";
import { MobId } from "../types";
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

	height: 1.43 + 1,

	animations: {
		[MobAnimation.Walk]: ["rbxassetid://913402848"],
	},
};
