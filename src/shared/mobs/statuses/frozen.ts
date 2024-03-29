import { MobStatus } from "../types";
import type { StatusDefinition } from ".";

export const frozenStatus: StatusDefinition<MobStatus.Frozen> = {
	id: MobStatus.Frozen,
	name: "Frozen",
	desc: "...",

	speed: 0,
};
