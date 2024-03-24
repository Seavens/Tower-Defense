import { TargetId } from "shared/types/ids";
import type { Mob } from "server/classes/mob";
import type { Node } from "@rbxts/octo-tree";
import type { TargetingModule } from ".";

export const lastTargeting: TargetingModule<TargetId.Last> = {
	id: TargetId.Last,

	getTarget: (mobs: Array<Node<Mob>>): Option<Mob> => {
		const last = mobs.pop();
		return last?.Object;
	},
};
