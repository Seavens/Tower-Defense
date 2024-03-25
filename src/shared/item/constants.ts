import { ItemRarity } from "shared/inventory/types";

export const RARITY_WEIGHTS: { [I in ItemRarity]: number } = {
	[ItemRarity.Rare]: 0.515, // 46.5% chance
	[ItemRarity.Epic]: 0.35, // 30% chance
	[ItemRarity.Legendary]: 0.1, // 20% chance
	[ItemRarity.Mythical]: 0.035, // 3.5% chance
	[ItemRarity.Secret]: 0, // 0% chance
};
