import type { MapDifficulty } from "../enums";
import type { MapId } from "../ids";
import type { WaveDefinition } from "./wave-definition";

export interface MapDefinition<I extends MapId> {
	id: I;
	name: string;
	desc: string;
	difficulty: MapDifficulty;
	waves: Array<WaveDefinition>;
	baseHealth: number;
}
