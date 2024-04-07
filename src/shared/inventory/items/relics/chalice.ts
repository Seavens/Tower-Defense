import { ItemId } from "../../types";
import { ItemKind } from "../../types";
import { ItemRarity } from "shared/inventory/types";
import type { ItemDefinition } from "..";

export const chaliceItem: ItemDefinition<ItemId.Chalice, ItemKind.Relic> = {
	id: ItemId.Chalice,
	name: "Chalice",
	desc: "A chalice that grants you a 1.3x multplier.",

	image: "rbxassetid://129697838",
	rarity: ItemRarity.Legendary,
	value: 18_000,

	kind: {
		kind: ItemKind.Relic,
		multiplier: 1.3,
	},
};
