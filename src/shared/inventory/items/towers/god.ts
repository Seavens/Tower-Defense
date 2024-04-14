import { ASSET_IDS } from "shared/assets/constants";
import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerAnimation, TowerSounds, TowerTargeting, TowerVisual } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const godTowerItem: ItemDefinition<ItemId.God, ItemKind.Tower> = {
	id: ItemId.God,
	name: "God Tower",
	desc: "A God tower that attacks enemies from anywhere.",

	rarity: ItemRarity.Mythical,
	image: `rbxassetid://16172534401`,
	value: 40_000,

	kind: {
		kind: ItemKind.Tower,

		damage: 84,
		range: 12,
		cooldown: 3,

		damageKind: MobDamage.Magic,
		limit: 3,
		cost: 700,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.3, range: 0.4, cooldown: -0.1 }, cost: 500 },
			{ upgrade: 2, multiplier: { damage: 0.6, range: 0.7, cooldown: -0.2 }, cost: 1000 },
			{ upgrade: 3, multiplier: { damage: 1.2, range: 1.4, cooldown: -0.3 }, cost: 1500 },
			{ upgrade: 4, multiplier: { damage: 1.8, range: 2.0, cooldown: -0.4 }, cost: 2000 },
			{ upgrade: 5, multiplier: { damage: 2.5, range: 2.5, cooldown: -0.5 }, cost: 2500 },
		],

		targeting: [
			TowerTargeting.First,
			TowerTargeting.Last,
			TowerTargeting.Strongest,
			TowerTargeting.Weakest,
			TowerTargeting.Farthest,
			TowerTargeting.Closest,
		],

		visual: [TowerVisual.Neutron],

		animations: {
			[TowerAnimation.Summon]: [ASSET_IDS.Summon],
			[TowerAnimation.Attack]: [ASSET_IDS.Attack],
			[TowerAnimation.Sell]: [ASSET_IDS.Sell],
			[TowerAnimation.Idle]: [ASSET_IDS.Idle],
		},
		sounds: {
			[TowerSounds.Summon]: [ASSET_IDS.BoomImpact],
		},
	},
};
