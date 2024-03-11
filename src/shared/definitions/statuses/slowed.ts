import { StatusId } from "shared/types/ids";
import type { StatusDefinition } from "shared/types/definitions";

export const slowedStatus: StatusDefinition<StatusId.Slowed> = {
	id: StatusId.Slowed,
	name: "Slowed",
	desc: "...",

	speed: -0.75,
};
