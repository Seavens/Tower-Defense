import { StatusId } from "shared/statuses/types";
import type { StatusDefinition } from ".";

export const slowedStatus: StatusDefinition<StatusId.Slowed> = {
	id: StatusId.Slowed,
	name: "Slowed",
	desc: "Under a slowing effect, reducing its attack or movement speed.",

	tick: 1 / 5,
};
