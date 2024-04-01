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
		range: 5,
		cooldown: 4,

		damageKind: MobDamage.Blunt,
		limit: 3,
		cost: 500,

		upgrades: [
			[1, { damage: 1.05, range: 1.04, cooldown: 0.98 }, 1000],
			[2, { damage: 1.08, range: 1.06, cooldown: 0.96 }, 2000],
			[3, { damage: 1.12, range: 1.08, cooldown: 0.94 }, 4000],
			[4, { damage: 1.16, range: 1.1, cooldown: 0.92 }, 8000],
			[5, { damage: 1.2, range: 1.12, cooldown: 0.9 }, 16000],
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
