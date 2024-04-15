import { ASSET_IDS } from "shared/assets/constants";
import { MobAnimation, MobDamage, MobId } from "shared/mob/types";
import type { MobDefinition } from ".";

export const airforceOne: MobDefinition<MobId.AirforceOne> = {
	id: MobId.AirforceOne,
	name: "Airforce One",
	desc: "...",

	speed: 6,
	resistances: [MobDamage.Blunt],
	health: 2276,

	bounty: 1838,
	experience: 684,

	height: 1.35,

	animations: {
		[MobAnimation.Walk]: [ASSET_IDS.WalkR6],
	},
};
