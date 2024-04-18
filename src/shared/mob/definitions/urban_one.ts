import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const urbanOne: MobDefinition<MobId.UrbanOne> = {
	id: MobId.UrbanOne,
	name: "Urban One",
	desc: "...",

	speed: 10,
	resistances: [],
	health: 165,

	bounty: 75,
	experience: 50,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
