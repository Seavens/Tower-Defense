import { TowerTargeting } from "shared/tower/types";
import type { Mob } from "shared/mob/api";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const strongestTargeting: TargetingModule<TowerTargeting.Strongest> = {
	id: TowerTargeting.Strongest,

	getTarget: (mobs: Array<Node<Mob>>): Option<Mob> => {
		let target: Option<Mob>;
		let strongest = 0;
		for (const { Object: mob } of mobs) {
			const health = mob.getHealth();
			if (strongest === undefined || health > strongest) {
				strongest = health;
				target = mob;
			}
		}
		return target;
	},
};
