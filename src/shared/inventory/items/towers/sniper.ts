import { ItemId } from "../../types";
import { ItemKind } from "../../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const sniperTowerItem: ItemDefinition<ItemId.Sniper, ItemKind.Tower> = {
	id: ItemId.Sniper,
	name: "Sniper Tower",
	desc: "A sniper tower that attacks enemies from a distance.",

	rarity: ItemRarity.Legendary,
	image: `rbxassetid://12270286289`,

	kind: {
		kind: ItemKind.Tower,

		damage: 57,
		range: 12,
		cooldown: 6,

		damageKind: MobDamage.Projectile,
		limit: 3,
		cost: 550,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.2, range: 0.3, cooldown: -0.05 }, cost: 350 },
			{ upgrade: 2, multiplier: { damage: 0.4, range: 0.5, cooldown: -0.1 }, cost: 600 },
			{ upgrade: 3, multiplier: { damage: 0.8, range: 0.9, cooldown: -0.15 }, cost: 900 },
			{ upgrade: 4, multiplier: { damage: 1.3, range: 1.2, cooldown: -0.2 }, cost: 1300 },
			{ upgrade: 5, multiplier: { damage: 1.9, range: 1.5, cooldown: -0.25 }, cost: 1900 },
			{ upgrade: 6, multiplier: { damage: 1.275701754385965, range: 1.7, cooldown: -0.3 }, cost: 2600 },
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
