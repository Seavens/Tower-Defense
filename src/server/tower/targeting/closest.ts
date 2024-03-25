import { TowerTargeting } from "shared/tower/types";
import type { Mob } from "server/mob/class";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const closestTargeting: TargetingModule<TowerTargeting.Closest> = {
	id: TowerTargeting.Closest,

	getTarget: (mobs: Array<Node<Mob>>): Option<Mob> => {
		let target: Option<Mob>;
		let closest = math.huge;
		for (const { Object: mob } of mobs) {
			const cframe = mob.getCFrame();
			const position = cframe.Position;
			const distance = position.Magnitude;
			if (closest === undefined || distance < closest) {
				closest = distance;
				target = mob;
			}
		}
		return target;
	},
};
