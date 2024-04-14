import { MobId } from "../../types";
import { SoldierThree } from "./soldier-three";
import { airforceFour } from "./airforce-four";
import { airforceOne } from "./airforce-one";
import { airforceThree } from "./airforce-three";
import { airforceTwo } from "./airforce-two";
import { navyFour } from "./navy-four";
import { navyOne } from "./navy-one";
import { navyThree } from "./navy-three";
import { navyTwo } from "./navy-two";
import { soldierOne } from "./soldier-one";
import { soldierTwo } from "./soldier-two";
import { urbanOne } from "./urban_one";
import { urbanThree } from "./urban-three";
import { urbanTwo } from "./urban-two";
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
	[MobId.UrbanOne]: urbanOne,
	[MobId.UrbanTwo]: urbanTwo,
	[MobId.UrbanThree]: urbanThree,
	[MobId.SoldierOne]: soldierOne,
	[MobId.SoldierTwo]: soldierTwo,
	[MobId.SoldierThree]: SoldierThree,
	[MobId.NavyOne]: navyOne,
	[MobId.NavyTwo]: navyTwo,
	[MobId.NavyThree]: navyThree,
	[MobId.NavyFour]: navyFour,
	[MobId.AirforceOne]: airforceOne,
	[MobId.AirforceTwo]: airforceTwo,
	[MobId.AirforceThree]: airforceThree,
	[MobId.AirforceFour]: airforceFour,
} as const;
