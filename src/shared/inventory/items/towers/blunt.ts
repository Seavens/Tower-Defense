import { ASSET_IDS } from "shared/assets/constants";
import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerAnimation, TowerSounds, TowerTargeting, TowerVisual } from "shared/tower/types";
import type { ItemDefinition } from "..";

export const bluntTowerItem: ItemDefinition<ItemId.Blunt, ItemKind.Tower> = {
	id: ItemId.Blunt,
	name: "Blunt Tower",
	desc: "A Blunt tower that attacks enemies as a groups.",

	image: `rbxassetid://16672016840`,
	rarity: ItemRarity.Epic,
	value: 10_000,

	kind: {
		kind: ItemKind.Tower,

		damage: 32,
		range: 9,
		cooldown: 4,

		damageKind: MobDamage.Blunt,
		limit: 4,
		cost: 500,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.3, range: 0.4, cooldown: -0.1 }, cost: 300 },
			{ upgrade: 2, multiplier: { damage: 0.6, range: 0.7, cooldown: -0.2 }, cost: 600 },
			{ upgrade: 3, multiplier: { damage: 1.2, range: 1.4, cooldown: -0.3 }, cost: 1000 },
			{ upgrade: 4, multiplier: { damage: 1.8, range: 2.0, cooldown: -0.4 }, cost: 1400 },
			{ upgrade: 5, multiplier: { damage: 2.5, range: 2.5, cooldown: -0.5 }, cost: 1800 },
		],

		targeting: [
			TowerTargeting.First,
			TowerTargeting.Last,
			TowerTargeting.Strongest,
			TowerTargeting.Weakest,
			TowerTargeting.Farthest,
			TowerTargeting.Closest,
		],

		visuals: [TowerVisual.SniperShot],

		abilities: [],

		animations: {
			[TowerAnimation.Summon]: [ASSET_IDS.Summon],
			[TowerAnimation.Attack]: [ASSET_IDS.Attack],
			[TowerAnimation.Sell]: [ASSET_IDS.Sell],
			[TowerAnimation.Idle]: [ASSET_IDS.Idle],
		},
		sounds: {
			[TowerSounds.Summon]: [ASSET_IDS.BoomImpact],
			[TowerSounds.Sell]: [ASSET_IDS.Fireball, ASSET_IDS.WarpCharge],
		},
	},
};
