import { ItemKind, ItemRarity } from "shared/inventory/types";
import { MobDamage } from "shared/mobs/types";

export const RARITY_WEIGHTS: { [I in ItemRarity]: number } = {
	[ItemRarity.Rare]: 0.515, // 46.5% chance
	[ItemRarity.Epic]: 0.35, // 30% chance
	[ItemRarity.Legendary]: 0.1, // 20% chance
	[ItemRarity.Mythical]: 0.035, // 3.5% chance
	[ItemRarity.Secret]: 0, // 0% chance
};

export const MIN_RANGE = 0.85;
export const MAX_RANGE = 1.15;

export const MAXIMUM_EQUIPPED = 6;
export const MAXIMUM_STORED = 210;

export const ITEM_KIND_DISPLAYS: { [K in ItemKind]: string } = {
	[ItemKind.Relic]: "Relic",
	[ItemKind.Tower]: "Tower",
} as const;
export const MOB_DAMAGE_DISPLAY: { [K in MobDamage]: string } = {
	[MobDamage.Sharp]: "Sharp",
	[MobDamage.Blunt]: "Blunt",
	[MobDamage.Magic]: "Magic",
	[MobDamage.Projectile]: "Projectile",
} as const;
