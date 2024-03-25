import { ItemClass } from "../types";
import { ItemId } from "../types";
import { ItemRarity } from "shared/inventory/types";
import type { ItemDefinition } from ".";

export const chaliceRelicItem: ItemDefinition<ItemId.Chalice, ItemClass.Relic> = {
	id: ItemId.Chalice,
	name: "Chalice",
	desc: "..",

	image: "rbxassetid://16452498785",
	rarity: ItemRarity.Legendary,

	class: {
		class: ItemClass.Relic,

		placeholder: 1,
	},
};
