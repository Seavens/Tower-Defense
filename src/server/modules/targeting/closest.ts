import { TargetId } from "shared/types/ids";
import type { Mob } from "server/classes/mob";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const closestTargeting: TargetingModule<TargetId.Closest> = {
	id: TargetId.Closest,

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
