import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
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
		range: 16,
		cooldown: 4,

		damageKind: MobDamage.Magic,
		limit: 1,
		cost: 700,

		upgrades: [
			[1, { damage: 1.05, range: 1.03, cooldown: 0.9 }, 1000],
			[2, { damage: 1.1, range: 1.06, cooldown: 96 }, 2000],
			[3, { damage: 1.2, range: 1.1, cooldown: 0.9 }, 4000],
			[4, { damage: 1.4, range: 1.2, cooldown: 0.8 }, 8000],
			[5, { damage: 1.8, range: 1.4, cooldown: 0.8 }, 16000],
			[6, { damage: 2.4, range: 1.8, cooldown: 0.7 }, 32000],
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
