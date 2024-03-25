import type { ItemClass, ItemId } from "../types";
import type { ItemRarity } from "shared/inventory/types";

export interface ItemClasses {
	[ItemClass.Tower]: ItemClass.Tower;
	[ItemClass.Relic]: ItemClass.Relic;
}

export interface ItemDefinition<I extends ItemId> {
	class: ItemClass;
	id: I;

	name: string;
	desc: string;
	rarity: ItemRarity;
	image: RBXAssetId;
}
