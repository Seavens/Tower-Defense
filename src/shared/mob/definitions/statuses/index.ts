import { MobStatus } from "../../types";
import { fastStatus } from "./fast";
import { frozenStatus } from "./frozen";
import { judgementStatus } from "./judgement";
import { slowedStatus } from "./slowed";
import type { MobDamage } from "../../types";

export interface StatusDefinition<I extends MobStatus> {
	id: I;
	name: string;
	desc: string;

	speed: number;
	damageKind: MobDamage;
}

export const statusDefinitions: { [S in MobStatus]: StatusDefinition<S> } = {
	[MobStatus.Slowed]: slowedStatus,
	[MobStatus.Fast]: fastStatus,
	[MobStatus.Frozen]: frozenStatus,
	[MobStatus.Judgement]: judgementStatus,
} as const;
