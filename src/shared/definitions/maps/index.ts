import { MapId } from "shared/types/ids";
import { testMap } from "./test";
import type { MapDefinition } from "shared/types/definitions";

export type AnyMapDefinition = (typeof MapDefinitions)[MapId];

export const MapDefinitions: { [I in MapId]: MapDefinition<I> } = {
	[MapId.Test]: testMap,
} as const;