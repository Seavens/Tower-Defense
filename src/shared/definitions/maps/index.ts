import { MapId } from "shared/types/ids";
import { testMap } from "./test";
import type { MapDefinition } from "shared/types/definitions";

export type AnyMapDefinition = (typeof mapDefinitions)[MapId];

export const mapDefinitions: { [I in MapId]: MapDefinition<I> } = {
	[MapId.Test]: testMap,
} as const;