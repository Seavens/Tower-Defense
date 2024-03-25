import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerId, TowerTargeting } from "../types";
import type { TowerDefinition } from ".";

export const meleeTower: TowerDefinition<TowerId.Melee> = {
	id: TowerId.Melee,
	name: "Melee Tower",
	desc: "A melee tower that attacks nearby enemies.",

	damage: [24, 34],
	range: [18, 22],
	cooldown: [3, 5],

	kind: MobDamage.Sharp,

	count: 5,
	cost: 100,

	rarity: ItemRarity.Rare,

	targeting: [
		TowerTargeting.First,
		TowerTargeting.Last,
		TowerTargeting.Strongest,
		TowerTargeting.Weakest,
		TowerTargeting.Farthest,
		TowerTargeting.Closest,
	],

	image: `rbxassetid://178007979`,
};
