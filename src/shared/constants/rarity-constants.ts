import { RarityId } from "shared/types/ids/rarity-id";

export const RARITY_WEIGHTS = {
	[RarityId.Rare]: 0.515, // 46.5% chance
	[RarityId.Epic]: 0.35, // 30% chance
	[RarityId.Legendary]: 0.1, // 20% chance
	[RarityId.Mythical]: 0.035, // 3.5% chance
	[RarityId.Secret]: 0, // 0% chance
};
