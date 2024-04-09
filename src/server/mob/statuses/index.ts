import type { Mob } from "../class";
import type { MobStatus } from "shared/mob/types";

export interface StatusModule<S extends MobStatus> {
	status: S;

	onTick: (mob: Mob, remaining: number) => void;
}

// export const mobStat
