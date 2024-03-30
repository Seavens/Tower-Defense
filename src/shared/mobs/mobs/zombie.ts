import { MobId } from "../types";
import type { MobDefinition } from ".";

export const zombieMob: MobDefinition<MobId.Zombie> = {
	id: MobId.Zombie,
	name: "Zombie",
	desc: "...",

	speed: 5,
	resistances: [],
	health: 10,

	reward: 10,
};
