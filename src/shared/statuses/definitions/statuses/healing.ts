import { StatusId } from "../../types";
import type { StatusDefinition } from ".";

export const healingStatus: StatusDefinition<StatusId.Healing> = {
	id: StatusId.Healing,
	name: "Healing",
	desc: "Under a healing effect, regenerating health over time.",

	tick: 1 / 5,
};
