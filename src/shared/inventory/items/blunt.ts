import { ItemKind } from "../types";
import { ItemId } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
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
		range: 15,
		cooldown: 4,

		damageKind: MobDamage.Blunt,
		count: 3,
		cost: 500,

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
