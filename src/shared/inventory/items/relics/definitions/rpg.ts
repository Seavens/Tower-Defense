import { ASSET_IDS } from "shared/assets/constants";
import { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import type { ItemDefinition } from "../..";

export const rpgItem: ItemDefinition<ItemId.RPG, ItemKind.Relic> = {
	id: ItemId.RPG,
	name: "RPG",
	desc: "An RPG to destroy your enemies, gives 1.3M x multiplier.",

	image: ASSET_IDS.RPG,
	rarity: ItemRarity.Legendary,
	value: math.huge,

	kind: {
		kind: ItemKind.Relic,
		multiplier: 1_300_000,
	},
};
