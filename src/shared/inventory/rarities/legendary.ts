import { ItemRarity } from "../types";
import { RARITY_WEIGHTS } from "../constants";
import type { RarityDefinition } from ".";

export const legendaryRarity: RarityDefinition<ItemRarity.Legendary> = {
	id: ItemRarity.Legendary,
	name: "Legendary",
	desc: "A legendary rarity.",
	weight: RARITY_WEIGHTS[ItemRarity.Legendary],
	color: Color3.fromRGB(255, 202, 75),
};
