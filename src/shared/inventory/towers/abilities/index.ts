import { TowerAbility } from "./types";
import { atomicVoidAbility } from "./atmoic-void";
import { godSpeakAbility as godSpeakAbility } from "./god-speak";
import type { AbilityTarget } from "./types";
import type { TowerVisual } from "shared/tower/types";

export interface AbilityEffect {
	damageMultiplier: number;
	rangeMultiplier: number;
	cooldownMultiplier: number;

	incomeMultiplier?: number;
}

export interface AbilityDefinition<I extends TowerAbility> {
	id: I;
	name: string;
	desc: string;

	visual: Array<TowerVisual>;

	coolDown: number;
	duration: number;
	areaEffect: boolean;
	targetType: AbilityTarget;
	effect: AbilityEffect;
}

export type AnyAbilityDefinition = AbilityDefinition<TowerAbility>;

export const abilityDefinitions: Record<TowerAbility, AnyAbilityDefinition> = {
	[TowerAbility.AtomicVoid]: atomicVoidAbility,
	[TowerAbility.GodSpeak]: godSpeakAbility,
} as const;
