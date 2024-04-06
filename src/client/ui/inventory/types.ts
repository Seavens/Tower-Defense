import { Flamework } from "@flamework/core";

export const enum InventoryFilterKind {
	All = "inventory_filter_kind:all",
	Level = "inventory_filter_kind:level",
	Rarity = "inventory_filter_kind:rarity",
	Locked = "inventory_filter_kind:locked",
	Unlocked = "inventory_filter_kind:unlocked",
}

export const isInventoryFilterKind = Flamework.createGuard<InventoryFilterKind>();
