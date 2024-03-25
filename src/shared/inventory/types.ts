import { Flamework } from "@flamework/core";

export const enum ItemRarity {
	Rare = "rarity_id:rare",
	Epic = "rarity_id:epic",
	Legendary = "rarity_id:legendary",
	Mythical = "rarity_id:mythical",
	Secret = "rarity_id:secret",
}

export const isItemRarity = Flamework.createGuard<ItemRarity>();
