import { TargetId } from "shared/types/ids";
import type { Mob } from "server/classes/mob";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const farthestTargeting: TargetingModule<TargetId.Farthest> = {
	id: TargetId.Farthest,

	getTarget: (mobs: Array<Node<Mob>>): Option<Mob> => {
		let target: Option<Mob>;
		let farthest = 0;
		for (const { Object: mob } of mobs) {
			const cframe = mob.getCFrame();
			const position = cframe.Position;
			const distance = position.Magnitude;
			if (farthest === undefined || distance > farthest) {
				farthest = distance;
				target = mob;
			}
		}
		return target;
	},
};
