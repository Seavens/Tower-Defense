import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from ".";

export const meleeTowerItem: ItemDefinition<ItemId.Melee, ItemKind.Tower> = {
	id: ItemId.Melee,
	name: "Melee Tower",
	desc: "A melee tower that attacks nearby enemies.",

	rarity: ItemRarity.Rare,
	image: `rbxassetid://178007979`,

	kind: {
		kind: ItemKind.Tower,

		damage: 24,
		range: 18,
		cooldown: 3,

		damageKind: MobDamage.Sharp,
		limit: 5,
		cost: 100,

		upgrades: [
			[1, [1.03, 1.02, 0.99], 150],
			[2, [1.06, 1.04, 0.98], 300],
			[3, [1.09, 1.06, 0.97], 600],
			[4, [1.12, 1.08, 0.96], 1200],
		],

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
