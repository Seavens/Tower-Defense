import { MapId } from "../types";
import { testMap } from "./test";
import type { MapDifficulty } from "../types";
import type { MobId } from "shared/mob/types";

export type WaveDefinition = {
	[I in MobId]?: {
		count: number; // Number of mobs to spawn
		delay: number; // Time to wait before starting to spawn mobs
		wait: number; // Time to wait between each mob spawn
	};
};

export interface MapDefinition<I extends MapId> {
	id: I;
	name: string;
	desc: string;
	difficulty: MapDifficulty;

	waves: {
		first: WaveDefinition;
		appearances: { [I in MobId]: number };
	};

	baseHealth: number;
}

export type AnyMapDefinition = (typeof mapDefinitions)[MapId];

export const mapDefinitions: { [I in MapId]: MapDefinition<I> } = {
	[MapId.Test]: testMap,
} as const;
