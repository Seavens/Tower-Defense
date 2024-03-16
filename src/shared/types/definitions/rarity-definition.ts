import type { RarityId } from "../ids/rarity-id";

export interface RarityDefinition<I extends RarityId> {
	id: I;
	name: string;
	desc: string;

	weight: number;
	colorRGB: [number, number, number];
}
