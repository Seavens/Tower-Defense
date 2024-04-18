import { StatusId } from "../../types";
import type { StatusDefinition } from ".";

export const shieldedStatus: StatusDefinition<StatusId.Shielded> = {
	id: StatusId.Shielded,
	name: "Shielded",
	desc: "Under a protective barrier, reducing incoming damage.",

	tick: 1 / 10,
};
