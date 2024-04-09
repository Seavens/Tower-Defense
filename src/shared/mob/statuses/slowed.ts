import { MobDamage, MobStatus } from "../types";
import type { StatusDefinition } from ".";

export const slowedStatus: StatusDefinition<MobStatus.Slowed> = {
	id: MobStatus.Slowed,
	name: "Slowed",
	desc: "...",
	damageKind: MobDamage.Magic,
};
