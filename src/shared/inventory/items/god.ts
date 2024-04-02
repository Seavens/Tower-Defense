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
			[1, { damage: 2, range: 0.1, cooldown: -0.1 }, 1000],
			[2, { damage: 3, range: 0.3, cooldown: -0.2 }, 2000],
			[3, { damage: 4, range: 0.5, cooldown: -0.3 }, 4000],
			[4, { damage: 5, range: 0.7, cooldown: -0.4 }, 8000],
			[5, { damage: 6, range: 1, cooldown: -0.5 }, 16000],
			[6, { damage: 7, range: 1.4, cooldown: -0.6 }, 32000],
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
