import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const navyOne: MobDefinition<MobId.NavyOne> = {
	id: MobId.NavyOne,
	name: "Navy One",
	desc: "...",

	speed: 7,
	resistances: [],
	health: 797,

	bounty: 511,
	experience: 240,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
