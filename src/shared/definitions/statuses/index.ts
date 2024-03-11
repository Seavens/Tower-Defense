import { StatusId } from "shared/types/ids";
import { fastStatus } from "./fast";
import { frozenStatus } from "./frozen";
import { slowedStatus } from "./slowed";
import type { StatusDefinition } from "shared/types/definitions";

export const statusDefinitions: { [I in StatusId]: StatusDefinition<I> } = {
	[StatusId.Slowed]: slowedStatus,
	[StatusId.Fast]: fastStatus,
	[StatusId.Frozen]: frozenStatus,
} as const;
