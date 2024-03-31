import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from ".";

export const sniperTowerItem: ItemDefinition<ItemId.Sniper, ItemKind.Tower> = {
	id: ItemId.Sniper,
	name: "Sniper Tower",
	desc: "A sniper tower that attacks enemies from a distance.",

	rarity: ItemRarity.Legendary,
	image: `rbxassetid://12270286289`,

	kind: {
		kind: ItemKind.Tower,

		damage: 53,
		range: 65,
		cooldown: 6,

		damageKind: MobDamage.Projectile,
		limit: 3,
		cost: 500,

		upgrades: [
			[1, [1.04, 1.02, 0.98], 1000],
			[2, [1.08, 1.04, 0.96], 2000],
			[3, [1.16, 1.08, 0.92], 4000],
			[4, [1.28, 1.16, 0.84], 8000],
			[5, [1.44, 1.24, 0.76], 16000],
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
