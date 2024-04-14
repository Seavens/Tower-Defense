import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const airforceFour: MobDefinition<MobId.AirforceFour> = {
	id: MobId.AirforceFour,
	name: "Airforce Four",
	desc: "...",

	speed: 5,
	resistances: [],
	health: 5000,

	bounty: 4800,
	experience: 1500,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
