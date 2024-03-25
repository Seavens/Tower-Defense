import { ItemRarity } from "../types";
import { RARITY_WEIGHTS } from "shared/item/constants";
import type { RarityDefinition } from ".";

export const epicRarity: RarityDefinition<ItemRarity.Epic> = {
	id: ItemRarity.Epic,
	name: "Epic",
	desc: "An epic rarity.",
	weight: RARITY_WEIGHTS[ItemRarity.Epic],
	color: Color3.fromRGB(106, 13, 173),
};
