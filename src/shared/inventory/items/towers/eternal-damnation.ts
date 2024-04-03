import { ItemId } from "../../types";
import { ItemKind } from "../../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const eternalDamnationTowerItem: ItemDefinition<ItemId.EternalDamnation, ItemKind.Tower> = {
	id: ItemId.EternalDamnation,
	name: "Eternal Damnation Tower",
	desc: "An eternal tower that attacks enemies from everything.",

	rarity: ItemRarity.Secret,
	image: `rbxassetid://11714891100`,

	kind: {
		kind: ItemKind.Tower,

		damage: 215,
		range: 12,
		cooldown: 0.5,

		damageKind: MobDamage.Magic,
		limit: 3,
		cost: 1000,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.2, range: 0.3, cooldown: 0.92 }, cost: 300 },
			{ upgrade: 2, multiplier: { damage: 0.4, range: 0.5, cooldown: 0.86 }, cost: 500 },
			{ upgrade: 3, multiplier: { damage: 0.8, range: 0.9, cooldown: 0.82 }, cost: 700 },
			{ upgrade: 4, multiplier: { damage: 1.3, range: 1.2, cooldown: 0.79 }, cost: 900 },
			{ upgrade: 5, multiplier: { damage: 1.9, range: 1.5, cooldown: 0.75 }, cost: 1900 },
			{ upgrade: 6, multiplier: { damage: 2.6, range: 1.7, cooldown: 0.72 }, cost: 2600 },
			{ upgrade: 7, multiplier: { damage: 3.4, range: 2.1, cooldown: 0.68 }, cost: 3400 },
			{ upgrade: 8, multiplier: { damage: 4.3, range: 2.5, cooldown: 0.65 }, cost: 4300 },
			{ upgrade: 9, multiplier: { damage: 5.3, range: 3, cooldown: 0.62 }, cost: 5300 },
			{ upgrade: 10, multiplier: { damage: 6.4, range: 3.5, cooldown: 0.59 }, cost: 6400 },
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