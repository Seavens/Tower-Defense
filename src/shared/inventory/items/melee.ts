import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
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
		range: 5,
		cooldown: 3,

		damageKind: MobDamage.Sharp,
		limit: 5,
		cost: 100,

		upgrades: [
			[1, { damage: 1.03, range: 1.01, cooldown: 0.99 }, 150],
			[2, { damage: 1.06, range: 1.03, cooldown: 0.98 }, 300],
			[3, { damage: 1.09, range: 1.06, cooldown: 0.97 }, 600],
			[4, { damage: 1.12, range: 1.08, cooldown: 0.96 }, 1200],
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
