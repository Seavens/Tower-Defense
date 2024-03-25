import { ItemClass } from "../types";
import { ItemId } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from ".";

export const meleeTowerItem: ItemDefinition<ItemId.Melee, ItemClass.Tower> = {
	id: ItemId.Melee,
	name: "Melee Tower",
	desc: "A melee tower that attacks nearby enemies.",

	rarity: ItemRarity.Rare,
	image: `rbxassetid://178007979`,

	class: {
		class: ItemClass.Tower,

		damage: 24,
		range: 18,
		cooldown: 3,

		kind: MobDamage.Sharp,
		count: 5,
		cost: 100,

		targeting: [
			TowerTargeting.First,
			TowerTargeting.Last,
			TowerTargeting.Strongest,
			TowerTargeting.Weakest,
			TowerTargeting.Farthest,
			TowerTargeting.Closest,
		],
	},
};
