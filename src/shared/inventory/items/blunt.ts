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
			[1, { damage: 0.4, range: 0.3, cooldown: -0.2 }, 1000],
			[2, { damage: 0.6, range: 0.6, cooldown: -0.25 }, 2000],
			[3, { damage: 0.7, range: 2, cooldown: -0.5 }, 4000],
			[4, { damage: 3.2, range: 1.6, cooldown: -0.3 }, 8000],
			[5, { damage: 6.4, range: 1.4, cooldown: -0.1 }, 16000],
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
