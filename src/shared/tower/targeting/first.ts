import { TowerTargeting } from "shared/tower/types";
import type { Mob } from "shared/mob/api";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const firstTargeting: TargetingModule<TowerTargeting.First> = {
	id: TowerTargeting.First,

	getTarget: (mobs: Array<Node<Mob>>): Option<Mob> => {
		const [first] = mobs;
		return first?.Object;
	},
};
