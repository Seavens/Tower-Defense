import { MobStatus } from "shared/mob/types";
import { judgementStatus } from "./judgement";
import type { Mob } from "shared/mob/api";

export interface StatusModule<S extends MobStatus> {
	status: S;

	onTick: (mob: Mob, remaining: number) => void;
}

export const statusModules: { [S in MobStatus]?: StatusModule<S> } = {
	[MobStatus.Judgement]: judgementStatus,
} as const;
