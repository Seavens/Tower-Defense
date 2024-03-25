import { ItemClass } from "../types";
import { ItemId } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from ".";

export const sniperTowerItem: ItemDefinition<ItemId.Sniper, ItemClass.Tower> = {
	id: ItemId.Sniper,
	name: "Sniper Tower",
	desc: "A sniper tower that attacks enemies from a distance.",

	rarity: ItemRarity.Legendary,
	image: `rbxassetid://12270286289`,

	class: {
		class: ItemClass.Tower,

		damage: 53,
		range: 65,
		cooldown: 6,

		kind: MobDamage.Projectile,
		count: 3,
		cost: 500,

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