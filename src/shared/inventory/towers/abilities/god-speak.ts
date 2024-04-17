import { AbilityTarget, TowerAbility } from "./types";
import { TowerVisual } from "shared/tower/types";
import type { AbilityDefinition } from ".";

export const godSpeakAbility: AbilityDefinition<TowerAbility.GodSpeak> = {
	id: TowerAbility.GodSpeak,
	name: "Holy Strike",
	desc: "...",
	visual: [TowerVisual.HolyStrike],
	coolDown: 12,
	duration: 0,
	areaEffect: true,
	targetType: AbilityTarget.Enemy,
	effect: {
		damageMultiplier: 0.5,
		rangeMultiplier: 0,
		cooldownMultiplier: 0,
	},
};
