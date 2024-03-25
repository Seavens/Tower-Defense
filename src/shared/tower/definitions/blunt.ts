import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerId, TowerTargeting } from "../types";
import type { TowerDefinition } from ".";

export const bluntTower: TowerDefinition<TowerId.Blunt> = {
	id: TowerId.Blunt,
	name: "Blunt Tower",
	desc: "A Blunt tower that attacks enemies as a groups.",

	damage: [32, 42],
	range: [15, 19],
	cooldown: [4, 7],

	kind: MobDamage.Blunt,

	count: 3,
	cost: 500,

	rarity: ItemRarity.Epic,

	targeting: [
		TowerTargeting.First,
		TowerTargeting.Last,
		TowerTargeting.Strongest,
		TowerTargeting.Weakest,
		TowerTargeting.Farthest,
		TowerTargeting.Closest,
	],

	image: `rbxassetid://16672016840`,
};
