import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const urbanTwo: MobDefinition<MobId.UrbanTwo> = {
	id: MobId.UrbanTwo,
	name: "Urban Two",
	desc: "...",

	speed: 9,
	resistances: [],
	health: 215,

	bounty: 103,
	experience: 65,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
