import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting, TowerVisual } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const sniperTowerItem: ItemDefinition<ItemId.Sniper, ItemKind.Tower> = {
	id: ItemId.Sniper,
	name: "Sniper Tower",
	desc: "A sniper tower that attacks enemies from a distance.",

	rarity: ItemRarity.Legendary,
	image: `rbxassetid://12270286289`,
	value: 16_000,

	kind: {
		kind: ItemKind.Tower,

		damage: 50,
		range: 15,
		cooldown: 5,

		damageKind: MobDamage.Projectile,
		limit: 3,
		cost: 550,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.2, range: 0.3, cooldown: -0.05 }, cost: 350 },
			{ upgrade: 2, multiplier: { damage: 0.4, range: 0.7, cooldown: -0.12 }, cost: 500 },
			{ upgrade: 3, multiplier: { damage: 0.8, range: 1.2, cooldown: -0.17 }, cost: 700 },
			{ upgrade: 4, multiplier: { damage: 1.3, range: 1.8, cooldown: -0.25 }, cost: 900 },
			{ upgrade: 5, multiplier: { damage: 1.9, range: 2.2, cooldown: -0.33 }, cost: 1900 },
			{ upgrade: 6, multiplier: { damage: 2.6, range: 3.4, cooldown: -0.45 }, cost: 2600 },
		],

		targeting: [
			TowerTargeting.First,
			TowerTargeting.Last,
			TowerTargeting.Strongest,
			TowerTargeting.Weakest,
			TowerTargeting.Farthest,
			TowerTargeting.Closest,
		],

		visual: TowerVisual.SniperShot,
	},
};
