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
		count: 1,
		cost: 700,

		targeting: [
			// TowerTargeting.First,
			// TowerTargeting.Last,
			TowerTargeting.Strongest,
			// TowerTargeting.Weakest,
			// TowerTargeting.Farthest,
			// TowerTargeting.Closest,
		],
	},
};
