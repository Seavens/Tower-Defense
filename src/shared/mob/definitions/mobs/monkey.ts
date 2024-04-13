import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
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

	height: 1.89,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.Walk],
	},
};
