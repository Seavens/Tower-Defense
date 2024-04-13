import { TowerTargeting } from "shared/tower/types";
import type { Mob } from "server/mob/class/class";
import type { TargetingModule } from ".";

export const noneTargeting: TargetingModule<TowerTargeting.None> = {
	id: TowerTargeting.None,

	getTarget: (): Option<Mob> => {
		return undefined;
	},
};
