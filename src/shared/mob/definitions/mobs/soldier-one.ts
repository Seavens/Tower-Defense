import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const soldierOne: MobDefinition<MobId.SoldierOne> = {
	id: MobId.SoldierOne,
	name: "Soldier One",
	desc: "...",

	speed: 9,
	resistances: [],
	health: 363,

	bounty: 196,
	experience: 110,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
