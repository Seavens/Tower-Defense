import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerId, TowerTargeting } from "../types";
import type { TowerDefinition } from ".";

export const sniperTower: TowerDefinition<TowerId.Sniper> = {
	id: TowerId.Sniper,
	name: "Sniper Tower",
	desc: "A sniper tower that attacks enemies from a distance.",

	damage: [53, 63],
	range: [65, 70],
	cooldown: [6, 10],

	kind: MobDamage.Projectile,

	count: 3,
	cost: 500,

	rarity: ItemRarity.Legendary,

	targeting: [
		TowerTargeting.First,
		TowerTargeting.Last,
		TowerTargeting.Strongest,
		TowerTargeting.Weakest,
		TowerTargeting.Farthest,
		TowerTargeting.Closest,
	],

	image: `rbxassetid://12270286289`,
};
