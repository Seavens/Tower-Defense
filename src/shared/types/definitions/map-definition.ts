import type { MapDifficulty } from "../enums";
import type { MapId, TowerId } from "../ids";
import type { WaveDefinition } from "./wave-definition";

export interface MapDefinition<I extends MapId> {
	id: I;
	name: string;
	desc: string;
	difficulty: MapDifficulty;
	waves: Array<WaveDefinition>;
	towerLimits: { [T in TowerId]: number };
	baseHealth: number;
}
