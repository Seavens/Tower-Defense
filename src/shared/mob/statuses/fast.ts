import { MobDamage, MobStatus } from "../types";
import type { StatusDefinition } from ".";

export const fastStatus: StatusDefinition<MobStatus.Fast> = {
	id: MobStatus.Fast,
	name: "Fast",
	desc: "...",
	damageKind: MobDamage.Magic,
};
