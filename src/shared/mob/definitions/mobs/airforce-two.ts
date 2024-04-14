import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const airforceTwo: MobDefinition<MobId.AirforceTwo> = {
	id: MobId.AirforceTwo,
	name: "Airforce Two",
	desc: "...",

	speed: 6,
	resistances: [],
	health: 2958,

	bounty: 2531,
	experience: 889,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
