import { StatusId } from "shared/statuses/types";
import type { StatusDefinition } from ".";

export const zoinkedStatus: StatusDefinition<StatusId.Zoinked> = {
	id: StatusId.Zoinked,
	name: "Zoinked",
	desc: "Zoinks!!!!!!!!",

	tick: 1,
};
