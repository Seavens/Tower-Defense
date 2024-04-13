import { MobId } from "../../types";
import { alienMob } from "./alien";
import { grimaceMob } from "./grimace";
import { monkeyMob } from "./monkey";
import { ratMob } from "./rat";
import type { MobAnimation, MobDamage } from "../../types";

export interface MobDefinition<I extends MobId> {
	id: I;
	name: string;
	desc: string;

	speed: number;
	resistances: Array<MobDamage>;
	health: number;

	bounty: number;

	experience: number;

	height: number;

	animations: { [K in MobAnimation]: Array<RBXAssetId> };
}

export type AnyMobDefinition = (typeof mobDefinitions)[MobId];

export const mobDefinitions: { [I in MobId]: MobDefinition<I> } = {
	[MobId.Rat]: ratMob,
	[MobId.Alien]: alienMob,
	[MobId.Monkey]: monkeyMob,
	[MobId.Grimace]: grimaceMob,
} as const;
