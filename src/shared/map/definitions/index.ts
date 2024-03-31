import { MapId } from "../types";
import { testMap } from "./test";
import type { MapDifficulty } from "../types";
import type { MobId } from "shared/mobs/types";
import type { TowerItemId } from "shared/inventory/types";

export type WaveDefinition = {
	[I in MobId]?: {
		count: number;
		wait: number;
		delay: number;
	};
};

export interface MapDefinition<I extends MapId> {
	id: I;
	name: string;
	desc: string;
	difficulty: MapDifficulty;
	waves: Array<WaveDefinition>;
	// towerLimits: { [T in TowerItemId]: number };
	baseHealth: number;
}

export type AnyMapDefinition = (typeof mapDefinitions)[MapId];

export const mapDefinitions: { [I in MapId]: MapDefinition<I> } = {
	[MapId.Test]: testMap,
} as const;
