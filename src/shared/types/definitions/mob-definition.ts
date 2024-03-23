import type { DamageKind } from "../kinds";
import type { MobId } from "../ids";

export interface MobDefinition<I extends MobId> {
	id: I;
	name: string;
	desc: string;

	speed: number;
	resistances: Array<DamageKind>;
	health: number;
}
