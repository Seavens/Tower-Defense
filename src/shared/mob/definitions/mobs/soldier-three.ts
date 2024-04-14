import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const SoldierThree: MobDefinition<MobId.SoldierThree> = {
	id: MobId.SoldierThree,
	name: "Soldier Three",
	desc: "...",

	speed: 8,
	resistances: [],
	health: 613,

	bounty: 371,
	experience: 185,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
