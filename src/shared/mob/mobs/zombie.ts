import { MobId } from "../types";
import type { MobDefinition } from ".";

export const zombieMob: MobDefinition<MobId.Zombie> = {
	id: MobId.Zombie,
	name: "Zombie",
	desc: "...",

	speed: 5,
	resistances: [],
	health: 100,

	bounty: 75,
	experience: 15,
};
