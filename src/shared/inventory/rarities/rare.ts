import { ItemRarity } from "../types";
import { RARITY_WEIGHTS } from "../constants";
import type { RarityDefinition } from ".";

export const rareRarity: RarityDefinition<ItemRarity.Rare> = {
	id: ItemRarity.Rare,
	name: "Rare",
	desc: "A rare rarity.",
	weight: RARITY_WEIGHTS[ItemRarity.Rare],
	color: Color3.fromRGB(69, 110, 194),
};
