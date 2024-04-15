import { type AbilityDefinition, TowerAbility } from ".";
import { TowerVisual } from "shared/tower/types";

export const neutronAbility: AbilityDefinition<TowerAbility.Neutron> = {
	id: TowerAbility.Neutron,
	name: "Neutron",
	desc: "...",

	visual: [TowerVisual.Neutron],
	damage: 1,
	cooldown: 1,
	range: 1,
};
