import { TargetId } from "shared/types/ids";
import type { Mob } from "server/classes/mob";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const weakestTargeting: TargetingModule<TargetId.Weakest> = {
	id: TargetId.Weakest,

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
