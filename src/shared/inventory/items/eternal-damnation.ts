import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from ".";

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
			[1, { damage: 1.2, range: 1.2, cooldown: 0.98 }, 1000],
			[2, { damage: 1.6, range: 1.08, cooldown: 0.96 }, 2000],
			[3, { damage: 1.8, range: 1.16, cooldown: 0.88 }, 4000],
			[4, { damage: 2.1, range: 1.32, cooldown: 0.76 }, 8000],
			[5, { damage: 2.7, range: 1.64, cooldown: 0.52 }, 16000],
			[6, { damage: 3.72, range: 2.08, cooldown: 0.28 }, 32000],
			[7, { damage: 4.84, range: 2.72, cooldown: 0.12 }, 64000],
			[8, { damage: 5.44, range: 3.52, cooldown: 0.04 }, 128000],
			[9, { damage: 7.68, range: 4.48, cooldown: 0.02 }, 256000],
			[10, { damage: 10.88, range: 5.76, cooldown: 0.01 }, 512000],
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
