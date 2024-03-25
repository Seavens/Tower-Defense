import { MobId } from "../types";
import { zombieMob } from "./zombie";
import type { MobDamage } from "../types";

export interface MobDefinition<I extends MobId> {
	id: I;
	name: string;
	desc: string;

	speed: number;
	resistances: Array<MobDamage>;
	health: number;
}

export const mobDefinitions: { [I in MobId]: MobDefinition<I> } = {
	[MobId.Zombie]: zombieMob,
} as const;
