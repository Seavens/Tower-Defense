import { holyStrikeAbility } from "./holy-strike";
import { neutronAbility } from "./neutron";
import type { TowerVisual } from "shared/tower/types";

export const enum TowerAbility {
	Neutron = "tower_ability:neutron",
	HolyStrike = "tower_ability:holy_strike",
}

export interface AbilityDefinition<I extends TowerAbility> {
	id: I;
	name: string;
	desc: string;

	visual: Array<TowerVisual>;
	damage: number;
	cooldown: number;
	range: number;
}

export type AnyAbilityDefinition = (typeof abilityDefinitions)[TowerAbility];

export const abilityDefinitions: { [I in TowerAbility]: AbilityDefinition<I> } = {
	[TowerAbility.Neutron]: neutronAbility,
	[TowerAbility.HolyStrike]: holyStrikeAbility,
} as const;
