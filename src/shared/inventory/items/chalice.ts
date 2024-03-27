import { ItemId } from "../types";
import { ItemKind } from "../types";
import { ItemRarity } from "shared/inventory/types";
import type { ItemDefinition } from ".";

export const chaliceRelicItem: ItemDefinition<ItemId.Chalice, ItemKind.Relic> = {
	id: ItemId.Chalice,
	name: "Chalice",
	desc: "..",

	image: "rbxassetid://16452498785",
	rarity: ItemRarity.Legendary,

	kind: {
		kind: ItemKind.Relic,
		multiplier: 1.2,
	},
};
