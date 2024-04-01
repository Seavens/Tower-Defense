import { MobStatus } from "../types";
import type { StatusDefinition } from ".";

export const slowedStatus: StatusDefinition<MobStatus.Slowed> = {
	id: MobStatus.Slowed,
	name: "Slowed",
	desc: "...",

	speed: -0.75,
};
