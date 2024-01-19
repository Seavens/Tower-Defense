import type { StatusId } from "../ids";

export interface StatusDefinition<I extends StatusId> {
	id: I;
	name: string;
	desc: string;

	speed: number;
}