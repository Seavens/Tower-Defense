import { ItemId } from "../../types";
import { ItemKind } from "../../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const bluntTowerItem: ItemDefinition<ItemId.Blunt, ItemKind.Tower> = {
	id: ItemId.Blunt,
	name: "Blunt Tower",
	desc: "A Blunt tower that attacks enemies as a groups.",

	image: `rbxassetid://16672016840`,
	rarity: ItemRarity.Epic,

	kind: {
		kind: ItemKind.Tower,

		damage: 32,
		range: 8,
		cooldown: 4,

		damageKind: MobDamage.Blunt,
		limit: 3,
		cost: 500,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.3, range: 0.4, cooldown: -0.2 }, cost: 300 },
			{ upgrade: 2, multiplier: { damage: 0.6, range: 0.7, cooldown: -0.4 }, cost: 500 },
			{ upgrade: 3, multiplier: { damage: 1, range: 1.2, cooldown: -0.6 }, cost: 700 },
			{ upgrade: 4, multiplier: { damage: 2.5, range: 1, cooldown: -0.5 }, cost: 1200 },
			{ upgrade: 5, multiplier: { damage: 2.9, range: 0.8, cooldown: -0.45 }, cost: 1500 },
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
