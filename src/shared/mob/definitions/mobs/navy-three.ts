import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const navyThree: MobDefinition<MobId.NavyThree> = {
	id: MobId.NavyThree,
	name: "Navy Three",
	desc: "...",

	speed: 7,
	resistances: [],
	health: 1346,

	bounty: 970,
	experience: 405,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
