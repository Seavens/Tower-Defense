import { ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";
import { TowerId, TowerTargeting } from "../types";
import type { TowerDefinition } from ".";

export const godTower: TowerDefinition<TowerId.God> = {
	id: TowerId.God,
	name: "God Tower",
	desc: "A God tower that attacks enemies from anywhere.",

	damage: [84, 94],
	range: [30, 50],
	cooldown: [4, 7],

	kind: MobDamage.Magic,

	count: 1,
	cost: 700,

	rarity: ItemRarity.Mythical,

	targeting: [
		TowerTargeting.First,
		TowerTargeting.Last,
		TowerTargeting.Strongest,
		TowerTargeting.Weakest,
		TowerTargeting.Farthest,
		TowerTargeting.Closest,
	],

	image: `rbxassetid://16172534401`,
};
