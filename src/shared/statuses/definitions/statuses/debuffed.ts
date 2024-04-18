import { StatusId } from "shared/statuses/types";
import type { StatusDefinition } from ".";

export const debuffedStatus: StatusDefinition<StatusId.Debuffed> = {
	id: StatusId.Debuffed,
	name: "Debuffed",
	desc: "Under a negative effect, reducing its attack or defense capabilities.",

	tick: 1 / 5,
};
