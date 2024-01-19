import { StatusId } from "shared/types/ids";
import type { StatusDefinition } from "shared/types/definitions";

export const frozenStatus: StatusDefinition<StatusId.Frozen> = {
	id: StatusId.Frozen,
	name: "Frozen",
	desc: "...",

	speed: 0,
};