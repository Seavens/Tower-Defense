import { TargetId } from "shared/types/ids";
import type { Mob } from "server/classes/mob";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const strongestTargeting: TargetingModule<TargetId.Strongest> = {
	id: TargetId.Strongest,

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
