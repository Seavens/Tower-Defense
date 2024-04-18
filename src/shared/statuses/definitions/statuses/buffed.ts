import { StatusId } from "shared/statuses/types";
import type { StatusDefinition } from ".";

export const buffedStatus: StatusDefinition<StatusId.Buffed> = {
	id: StatusId.Buffed,
	name: "Buffed",
	desc: "Under a positive effect, enhancing its attack or defense capabilities.",

	tick: 1 / 5,
};
