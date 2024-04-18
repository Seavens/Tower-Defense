import { ASSET_IDS } from "shared/assets/constants";
import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerAnimation, TowerSounds, TowerTargeting } from "shared/tower/types";
import type { ItemDefinition } from "../..";

export const supporterTowerItem: ItemDefinition<ItemId.Supporter, ItemKind.Tower> = {
	id: ItemId.Supporter,
	name: "Supporter Tower",
	desc: "Buffing tower for near by allies.",

	image: `rbxassetid://33699721`,
	rarity: ItemRarity.Legendary,
	value: 15_000,

	kind: {
		kind: ItemKind.Tower,

		damage: 0,
		range: 8,
		cooldown: 1,

		limit: 3,
		cost: 800,
		damageKind: MobDamage.None,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 1, range: 0.2, cooldown: 1 }, cost: 400 },
			{ upgrade: 2, multiplier: { damage: 2, range: 0.4, cooldown: 1 }, cost: 700 },
			{ upgrade: 3, multiplier: { damage: 3, range: 0.9, cooldown: 1 }, cost: 1200 },
			{ upgrade: 4, multiplier: { damage: 4, range: 1.2, cooldown: 1 }, cost: 1600 },
			{ upgrade: 5, multiplier: { damage: 5, range: 1.8, cooldown: 1 }, cost: 2000 },
		],

		targeting: [TowerTargeting.None],

		visuals: [],

		abilities: undefined,

		animations: {
			[TowerAnimation.Summon]: [ASSET_IDS.Summon],
			[TowerAnimation.Attack]: [],
			[TowerAnimation.Sell]: [ASSET_IDS.Sell],
			[TowerAnimation.Idle]: [ASSET_IDS.Idle],
		},
		sounds: {
			[TowerSounds.Summon]: [ASSET_IDS.BoomImpact],
			[TowerSounds.Sell]: [ASSET_IDS.Fireball, ASSET_IDS.WarpCharge],
		},
	},
};
