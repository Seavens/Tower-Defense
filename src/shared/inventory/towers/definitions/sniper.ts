import { ASSET_IDS } from "shared/assets/constants";
import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mob/types";
import { TowerAnimation, TowerSounds, TowerTargeting, TowerVisual, TowerVisuals } from "shared/tower/types";
import type { ItemDefinition } from "../..";

export const sniperTowerItem: ItemDefinition<ItemId.Sniper, ItemKind.Tower> = {
	id: ItemId.Sniper,
	name: "Sniper Tower",
	desc: "A sniper tower that attacks enemies from a distance.",

	rarity: ItemRarity.Legendary,
	image: `rbxassetid://12270286289`,
	value: 16_000,

	kind: {
		kind: ItemKind.Tower,

		damage: 70,
		range: 15,
		cooldown: 4,

		damageKind: MobDamage.Projectile,
		limit: 4,
		cost: 550,

		upgrades: [
			{ upgrade: 1, multiplier: { damage: 0.3, range: 0.4, cooldown: -0.1 }, ability: false, cost: 400 },
			{ upgrade: 2, multiplier: { damage: 0.6, range: 0.7, cooldown: -0.2 }, ability: false, cost: 700 },
			{ upgrade: 3, multiplier: { damage: 1.2, range: 1.4, cooldown: -0.3 }, ability: false, cost: 1200 },
			{ upgrade: 4, multiplier: { damage: 1.8, range: 2.0, cooldown: -0.4 }, ability: false, cost: 1600 },
			{ upgrade: 5, multiplier: { damage: 2.5, range: 2.5, cooldown: -0.5 }, ability: false, cost: 2000 },
		],

		targeting: [
			TowerTargeting.First,
			TowerTargeting.Last,
			TowerTargeting.Strongest,
			TowerTargeting.Weakest,
			TowerTargeting.Farthest,
			TowerTargeting.Closest,
		],

		visuals: {
			[TowerVisuals.Summon]: TowerVisual.HeatedImpact,
			[TowerVisuals.Attack]: TowerVisual.SniperShot,
		},

		abilities: undefined,

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
