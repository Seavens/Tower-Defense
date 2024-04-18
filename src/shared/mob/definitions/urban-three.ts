import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const urbanThree: MobDefinition<MobId.UrbanThree> = {
	id: MobId.UrbanThree,
	name: "Urban Three",
	desc: "...",

	speed: 9,
	resistances: [],
	health: 225,

	bounty: 225,
	experience: 100,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
