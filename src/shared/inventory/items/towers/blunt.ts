import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting, TowerVisual } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const bluntTowerItem: ItemDefinition<ItemId.Blunt, ItemKind.Tower> = {
	id: ItemId.Blunt,
	name: "Blunt Tower",
	desc: "A Blunt tower that attacks enemies as a groups.",

	image: `rbxassetid://16672016840`,
	rarity: ItemRarity.Epic,
	value: 10_000,

	kind: {
		kind: ItemKind.Tower,

		damage: 32,
		range: 9,
		cooldown: 6,

		damageKind: MobDamage.Blunt,
		limit: 3,
		cost: 500,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.4, range: 0.3, cooldown: -0.2 }, cost: 300 },
			{ upgrade: 2, multiplier: { damage: 0.65, range: 0.5, cooldown: -0.3 }, cost: 500 },
			{ upgrade: 3, multiplier: { damage: 1, range: 0.8, cooldown: -0.4 }, cost: 700 },
			{ upgrade: 4, multiplier: { damage: 2.5, range: 1.1, cooldown: -0.35 }, cost: 1200 },
			{ upgrade: 5, multiplier: { damage: 2.9, range: 0.9, cooldown: -0.28 }, cost: 1500 },
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
