import { StatusId } from "shared/types/ids";
import type { StatusDefinition } from "shared/types/definitions";

export const fastStatus: StatusDefinition<StatusId.Fast> = {
	id: StatusId.Fast,
	name: "Fast",
	desc: "...",

	speed: 2,
};