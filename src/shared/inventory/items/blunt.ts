import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from ".";

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
			[1, { damage: 1.2, range: 1.2, cooldown: 0.98 }, 1000],
			[2, { damage: 1.5, range: 1.5, cooldown: 0.94 }, 2000],
			[3, { damage: 1.7, range: 1.8, cooldown: 0.87 }, 4000],
			[4, { damage: 1.9, range: 2.2, cooldown: 0.83 }, 8000],
			[5, { damage: 2.2, range: 2.6, cooldown: 0.76 }, 16000],
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
