import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const navyFour: MobDefinition<MobId.NavyFour> = {
	id: MobId.NavyFour,
	name: "Navy Four",
	desc: "...",

	speed: 6,
	resistances: [],
	health: 175,

	bounty: 1335,
	experience: 527,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
