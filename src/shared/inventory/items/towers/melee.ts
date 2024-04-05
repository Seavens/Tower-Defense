import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting, TowerVisual } from "shared/tower/types";
import type { ItemDefinition } from "..";

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
			{ upgrade: 1, multiplier: { damage: 0.2, range: 0.3, cooldown: 0.92 }, cost: 300 },
			{ upgrade: 2, multiplier: { damage: 0.4, range: 0.5, cooldown: 0.86 }, cost: 500 },
			{ upgrade: 3, multiplier: { damage: 0.8, range: 0.9, cooldown: 0.82 }, cost: 700 },
			{ upgrade: 4, multiplier: { damage: 1.3, range: 2.995, cooldown: 0.79 }, cost: 900 },
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
