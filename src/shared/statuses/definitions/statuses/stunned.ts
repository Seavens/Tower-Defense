import { StatusId } from "shared/statuses/types";
import type { StatusDefinition } from ".";

export const stunnedStatus: StatusDefinition<StatusId.Stunned> = {
	id: StatusId.Stunned,
	name: "Stunned",
	desc: "Unable to perform any actions due to stunning effect.",

	tick: 1 / 5,
};
