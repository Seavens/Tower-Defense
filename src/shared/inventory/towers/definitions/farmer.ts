import { ASSET_IDS } from "shared/assets/constants";
import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerAnimation, TowerSounds, TowerTargeting, TowerVisual, TowerVisuals } from "shared/tower/types";
import type { ItemDefinition } from "../..";

export const farmerTowerItem: ItemDefinition<ItemId.Farmer, ItemKind.Tower> = {
	id: ItemId.Farmer,
	name: "Farming Tower",
	desc: "Money collecting tower.",

	image: `rbxassetid://10344364375`,
	rarity: ItemRarity.Legendary,
	value: 13_000,

	kind: {
		kind: ItemKind.Tower,

		damage: 0,
		range: 0,
		cooldown: 5,
		income: 50 * 10 ** 8,

		limit: 1,
		cost: 1000,
		damageKind: MobDamage.None,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0, range: 0, cooldown: 0, income: 0.3 }, ability: false, cost: 500 },
			{ upgrade: 2, multiplier: { damage: 0, range: 0, cooldown: 0, income: 0.6 }, ability: false, cost: 800 },
			{ upgrade: 3, multiplier: { damage: 0, range: 0, cooldown: 0, income: 0.9 }, ability: false, cost: 1200 },
			{ upgrade: 4, multiplier: { damage: 0, range: 0, cooldown: 0, income: 1.2 }, ability: false, cost: 1800 },
			{ upgrade: 5, multiplier: { damage: 0, range: 0, cooldown: 0, income: 1.5 }, ability: false, cost: 2400 },
		],

		targeting: [TowerTargeting.None],

		visuals: {
			[TowerVisuals.Summon]: TowerVisual.HeatedImpact,
			[TowerVisuals.Attack]: TowerVisual.SniperShot,
		},

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
