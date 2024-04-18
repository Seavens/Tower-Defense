import { StatusId } from "shared/statuses/types";
import type { StatusDefinition } from ".";

export const frozenStatus: StatusDefinition<StatusId.Frozen> = {
	id: StatusId.Frozen,
	name: "Frozen",
	desc: "Unable to move or perform actions due to freezing effect.",

	tick: 1 / 5,
};
