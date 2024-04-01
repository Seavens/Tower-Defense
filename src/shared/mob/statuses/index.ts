import { MobStatus } from "../types";
import { fastStatus } from "./fast";
import { frozenStatus } from "./frozen";
import { slowedStatus } from "./slowed";

export interface StatusDefinition<I extends MobStatus> {
	id: I;
	name: string;
	desc: string;

	speed: number;
}

export const statusDefinitions: { [S in MobStatus]: StatusDefinition<S> } = {
	[MobStatus.Slowed]: slowedStatus,
	[MobStatus.Fast]: fastStatus,
	[MobStatus.Frozen]: frozenStatus,
} as const;
