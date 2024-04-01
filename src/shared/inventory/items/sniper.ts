import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
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
			[1, { damage: 1.04, range: 1.02, cooldown: 0.98 }, 1000],
			[2, { damage: 1.08, range: 1.04, cooldown: 0.96 }, 2000],
			[3, { damage: 1.16, range: 1.08, cooldown: 0.92 }, 4000],
			[4, { damage: 1.28, range: 1.16, cooldown: 0.84 }, 8000],
			[5, { damage: 1.44, range: 1.24, cooldown: 0.76 }, 16000],
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
