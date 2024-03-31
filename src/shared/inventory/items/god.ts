import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from ".";

export const godTowerItem: ItemDefinition<ItemId.God, ItemKind.Tower> = {
	id: ItemId.God,
	name: "God Tower",
	desc: "A God tower that attacks enemies from anywhere.",

	rarity: ItemRarity.Mythical,
	image: `rbxassetid://16172534401`,

	kind: {
		kind: ItemKind.Tower,

		damage: 84,
		range: 30,
		cooldown: 4,

		damageKind: MobDamage.Magic,
		limit: 1,
		cost: 700,

		upgrades: [
			[1, [1.05, 1.03, 0.98], 1000],
			[2, [1.1, 1.06, 96], 2000],
			[3, [1.2, 1.1, 0.92], 4000],
			[4, [1.4, 1.2, 0.86], 8000],
			[5, [1.8, 1.4, 0.8], 16000],
			[6, [2.4, 1.8, 0.7], 32000],
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
