import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting, TowerVisual } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const godTowerItem: ItemDefinition<ItemId.God, ItemKind.Tower> = {
	id: ItemId.God,
	name: "God Tower",
	desc: "A God tower that attacks enemies from anywhere.",

	rarity: ItemRarity.Mythical,
	image: `rbxassetid://16172534401`,

	kind: {
		kind: ItemKind.Tower,

		damage: 84,
		range: 16,
		cooldown: 4,

		damageKind: MobDamage.Magic,
		limit: 1,
		cost: 700,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.2, range: 0.3, cooldown: 0.08999999999999997 }, cost: 300 },
			{ upgrade: 2, multiplier: { damage: 0.4, range: 0.5, cooldown: 0.025000000000000026 }, cost: 500 },
			{ upgrade: 3, multiplier: { damage: 0.8, range: 0.9, cooldown: 0.82 }, cost: 700 },
			{ upgrade: 4, multiplier: { damage: 1.3, range: 0.14, cooldown: 0.79 }, cost: 900 },
			{ upgrade: 5, multiplier: { damage: 1.9, range: 1.5, cooldown: 0.75 }, cost: 1900 },
			{ upgrade: 6, multiplier: { damage: 2.6, range: 1.7, cooldown: 0.72 }, cost: 2600 },
			{ upgrade: 7, multiplier: { damage: 3.4, range: 2.1, cooldown: 0.68 }, cost: 3400 },
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
