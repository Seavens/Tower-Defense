import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from ".";

export const enternalDamnationTowerItem: ItemDefinition<ItemId.EternalDamnation, ItemKind.Tower> = {
	id: ItemId.EternalDamnation,
	name: "Enternal Damnation Tower",
	desc: "An enternal tower that attacks enemies from everything.",

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
