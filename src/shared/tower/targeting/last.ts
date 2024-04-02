import { TowerTargeting } from "shared/tower/types";
import type { Mob } from "server/mob/class";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const lastTargeting: TargetingModule<TowerTargeting.Last> = {
	id: TowerTargeting.Last,

	getTarget: (mobs: Array<Node<Mob>>): Option<Mob> => {
		const last = mobs.pop();
		return last?.Object;
	},
};
