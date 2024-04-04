import { ItemRarity } from "../types";
import { RARITY_WEIGHTS } from "../constants";
import type { RarityDefinition } from ".";

export const mythicalRarity: RarityDefinition<ItemRarity.Mythical> = {
	id: ItemRarity.Mythical,
	name: "Mythical",
	desc: "A mythical rarity.",
	weight: RARITY_WEIGHTS[ItemRarity.Mythical],
	color: Color3.fromRGB(255, 255, 255),
};
