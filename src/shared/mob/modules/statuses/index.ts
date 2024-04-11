import { MobStatus } from "shared/mob/types";
import { judgementStatus } from "./judgement";
import type { Mob } from "shared/mob/api";

export interface StatusModule<S extends MobStatus> {
	status: S;

	onAdded?: (mob: Mob) => void;
	onTick: (mob: Mob, remaining: number) => void;
	onRemove?: (mob: Mob) => void;
}

export const statusModules: { [S in MobStatus]?: StatusModule<S> } = {
	[MobStatus.Judgement]: judgementStatus,
} as const;
