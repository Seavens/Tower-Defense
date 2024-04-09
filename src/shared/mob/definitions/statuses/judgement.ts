import { MobDamage, MobStatus } from "../../types";
import type { StatusDefinition } from ".";

export const judgementStatus: StatusDefinition<MobStatus.Judgement> = {
	id: MobStatus.Judgement,
	name: "Judgement",
	desc: "...",

	speed: 0,
	damageKind: MobDamage.Magic,
};