import { TowerTargeting } from "shared/tower/types";
import { closestTargeting } from "./closest";
import { farthestTargeting } from "./farthest";
import { firstTargeting } from "./first";
import { lastTargeting } from "./last";
import { noneTargeting } from "./none";
import { strongestTargeting } from "./strongest";
import { weakestTargeting } from "./weakest";
import type { Mob } from "server/mob/class";
import type { Node } from "@rbxts/octo-tree";

export interface TargetingModule<I extends TowerTargeting> {
	id: I;

	getTarget: (mobs: Array<Node<Mob>>) => Option<Mob>;
}

export const targetingModules: { [I in TowerTargeting]: TargetingModule<I> } = {
	[TowerTargeting.First]: firstTargeting,
	[TowerTargeting.Last]: lastTargeting,
	[TowerTargeting.Strongest]: strongestTargeting,
	[TowerTargeting.Weakest]: weakestTargeting,
	[TowerTargeting.Closest]: closestTargeting,
	[TowerTargeting.Farthest]: farthestTargeting,
	[TowerTargeting.None]: noneTargeting,
} as const;
