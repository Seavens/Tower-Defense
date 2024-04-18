import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const soldierTwo: MobDefinition<MobId.SoldierTwo> = {
	id: MobId.SoldierTwo,
	name: "Soldier Two",
	desc: "...",

	speed: 8,
	resistances: [],
	health: 471,

	bounty: 270,
	experience: 142,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
