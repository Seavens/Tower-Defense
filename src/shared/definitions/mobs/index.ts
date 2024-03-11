import { MobId } from "shared/types/ids";
import { zombieMob } from "./zombie";
import type { MobDefinition } from "shared/types/definitions";

export const mobDefinitions: { [I in MobId]: MobDefinition<I> } = {
	[MobId.Zombie]: zombieMob,
} as const;
