import { TowerTargeting } from "shared/tower/types";
import type { Mob } from "shared/mob/api";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const weakestTargeting: TargetingModule<TowerTargeting.Weakest> = {
	id: TowerTargeting.Weakest,

	getTarget: (mobs: Array<Node<Mob>>): Option<Mob> => {
		let target: Option<Mob>;
		let weakest = math.huge;
		for (const { Object: mob } of mobs) {
			const health = mob.getHealth();
			if (weakest === undefined || health < weakest) {
				weakest = health;
				target = mob;
			}
		}
		return target;
	},
};
