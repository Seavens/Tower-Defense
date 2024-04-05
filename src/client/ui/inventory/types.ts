import { Flamework } from "@flamework/core";

export const enum InventoryFilterKind {
	Level = "inventory_filter_kind:level",
	Rarity = "inventory_filter_kind:rarity",
}

export const isInventoryFilterKind = Flamework.createGuard<InventoryFilterKind>();
