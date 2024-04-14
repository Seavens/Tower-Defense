import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const navyTwo: MobDefinition<MobId.NavyTwo> = {
	id: MobId.NavyTwo,
	name: "Navy Two",
	desc: "...",

	speed: 7,
	resistances: [],
	health: 1036,

	bounty: 704,
	experience: 312,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
