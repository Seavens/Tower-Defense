import { ASSET_IDS } from "shared/assets/constants";
import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerAnimation, TowerSounds, TowerTargeting, TowerVisual } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const meleeTowerItem: ItemDefinition<ItemId.Melee, ItemKind.Tower> = {
	id: ItemId.Melee,
	name: "Melee Tower",
	desc: "A melee tower that attacks nearby enemies.",

	rarity: ItemRarity.Rare,
	image: `rbxassetid://178007979`,
	value: 1_000,

	kind: {
		kind: ItemKind.Tower,

		damage: 24,
		range: 7,
		cooldown: 2,

		damageKind: MobDamage.Sharp,
		limit: 7,
		cost: 100,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.3, range: 0.4, cooldown: -0.1 }, cost: 200 },
			{ upgrade: 2, multiplier: { damage: 0.6, range: 0.7, cooldown: -0.2 }, cost: 500 },
			{ upgrade: 3, multiplier: { damage: 1.2, range: 1.4, cooldown: -0.3 }, cost: 800 },
			{ upgrade: 4, multiplier: { damage: 1.8, range: 2.0, cooldown: -0.4 }, cost: 1000 },
			{ upgrade: 5, multiplier: { damage: 2.5, range: 2.5, cooldown: -0.5 }, cost: 1300 },
		],

		targeting: [
			TowerTargeting.First,
			TowerTargeting.Last,
			TowerTargeting.Strongest,
			TowerTargeting.Weakest,
			TowerTargeting.Farthest,
			TowerTargeting.Closest,
		],

		visual: [TowerVisual.HeatedImpact, TowerVisual.SniperShot],

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
