import { MobId } from "shared/types/ids";
import type { MobDefinition } from "shared/types/definitions";

export const zombieMob: MobDefinition<MobId.Zombie> = {
	id: MobId.Zombie,
	name: "Zombie",
	desc: "...",

	speed: 10,
	resistances: [],
	health: 10,
};