import { AbilityTarget, TowerAbility } from "./types";
import { TowerVisual } from "shared/tower/types";
import type { AbilityDefinition } from ".";

export const atomicVoidAbility: AbilityDefinition<TowerAbility.AtomicVoid> = {
	id: TowerAbility.AtomicVoid,
	name: "Neutron",
	desc: "...",
	visual: [TowerVisual.Neutron],
	coolDown: 15,
	duration: 3,
	areaEffect: true,
	targetType: AbilityTarget.Enemy,
	effect: {
		damageMultiplier: 0.5,
		rangeMultiplier: 0,
		cooldownMultiplier: 0,
	},
};
