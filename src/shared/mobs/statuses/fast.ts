import { MobStatus } from "../types";
import type { StatusDefinition } from ".";

export const fastStatus: StatusDefinition<MobStatus.Fast> = {
	id: MobStatus.Fast,
	name: "Fast",
	desc: "...",

	speed: 2,
};
