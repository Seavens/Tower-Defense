import { ItemRarity } from "../types";
import { RARITY_WEIGHTS } from "../constants";
import type { RarityDefinition } from ".";

export const secretRarity: RarityDefinition<ItemRarity.Secret> = {
	id: ItemRarity.Secret,
	name: "Secret",
	desc: "A secret rarity.",
	weight: RARITY_WEIGHTS[ItemRarity.Secret],
	color: Color3.fromRGB(0, 0, 0),
};
