import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const airforceThree: MobDefinition<MobId.AirforceThree> = {
	id: MobId.AirforceThree,
	name: "Airforce Three",
	desc: "...",

	speed: 5,
	resistances: [],
	health: 3846,

	bounty: 3486,
	experience: 1155,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
