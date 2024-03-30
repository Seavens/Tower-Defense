import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
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

		damage: 95,
		range: 65,
		cooldown: 0.5,

		damageKind: MobDamage.Magic,
		count: 3,
		cost: 1000,

		// lol
		upgrades: [
			[1, [1.06, 1.04, 0.98], 1000],
			[2, [1.12, 1.08, 0.96], 2000],
			[3, [1.24, 1.16, 0.88], 4000],
			[4, [1.48, 1.32, 0.76], 8000],
			[5, [1.96, 1.64, 0.52], 16000],
			[6, [2.72, 2.08, 0.28], 32000],
			[7, [3.84, 2.72, 0.12], 64000],
			[8, [5.44, 3.52, 0.04], 128000],
			[9, [7.68, 4.48, 0.02], 256000],
			[10, [10.88, 5.76, 0.01], 512000],
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
