import { TargetId } from "shared/types/ids";
import { closestTargeting } from "./closest";
import { farthestTargeting } from "./farthest";
import { firstTargeting } from "./first";
import { lastTargeting } from "./last";
import { strongestTargeting } from "./strongest";
import { weakestTargeting } from "./weakest";
import type { Mob } from "server/classes/mob";
import type { Node } from "@rbxts/octo-tree";

export interface TargetingModule<I extends TargetId> {
	id: I;

	getTarget: (mobs: Array<Node<Mob>>) => Option<Mob>;
}

export const targetingModules: { [I in TargetId]: TargetingModule<I> } = {
	[TargetId.First]: firstTargeting,
	[TargetId.Last]: lastTargeting,
	[TargetId.Strongest]: strongestTargeting,
	[TargetId.Weakest]: weakestTargeting,
	[TargetId.Closest]: closestTargeting,
	[TargetId.Farthest]: farthestTargeting,
} as const;
