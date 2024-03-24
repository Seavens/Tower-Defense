import { TargetId } from "shared/types/ids";
import type { Mob } from "server/classes/mob";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const firstTargeting: TargetingModule<TargetId.First> = {
	id: TargetId.First,

	getTarget: (mobs: Array<Node<Mob>>): Option<Mob> => {
		const [first] = mobs;
		return first?.Object;
	},
};
