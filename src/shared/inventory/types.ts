import { Flamework } from "@flamework/core";
import { isUUID } from "shared/guards";
import { t } from "@rbxts/t";
import type { ItemDefinition, itemDefinitions } from "./items";

export const enum ItemFiltering {
	All = "item_filter:all",
	Rarity = "item_filter:rarity",
	Level = "item_filter:level",
	Items = "item_filter:items",
	Locked = "item_filter:locked",
}

export const enum ItemRarity {
	Rare = "rarity_id:rare",
	Epic = "rarity_id:epic",
	Legendary = "rarity_id:legendary",
	Mythical = "rarity_id:mythical",
	Secret = "rarity_id:secret",
}

export const enum ItemKind {
	Tower = "item_kind:tower",
	Relic = "item_kind:relic",
}

export const enum ItemId {
	Sniper = "item_id:sniper",
	Melee = "item_id:melee",
	Blunt = "item_id:blunt",
	God = "item_id:god",
	EternalDamnation = "item_id:eternal_damnation",
	Chalice = "item_id:chalice",
}
type KindItemIds<K extends ItemKind> = {
	[I in keyof typeof itemDefinitions]: (typeof itemDefinitions)[I] extends ItemDefinition<I, K> ? I : never;
}[ItemId];

export type RelicItemId = KindItemIds<ItemKind.Relic>;
export type TowerItemId = KindItemIds<ItemKind.Tower>;

export interface ItemTowerUnique {
	kind: ItemKind.Tower;
	damage: number;
	range: number;
	cooldown: number;
	owner: number;
	level: number;
	experience: number;
	locked: boolean;
}

export interface ItemRelicUnique {
	kind: ItemKind.Relic;
	multiplier: number;
	locked: boolean;
}

export type ItemUnique<T extends ItemKind = ItemKind> = {
	[ItemKind.Tower]: ItemTowerUnique;
	[ItemKind.Relic]: ItemRelicUnique;
}[T];

export interface Item {
	id: ItemId;
	uuid: UUID;
	unique: ItemUnique;
}

export const isItemRarity = Flamework.createGuard<ItemRarity>();
export const isItemTowerUnique = Flamework.createGuard<ItemTowerUnique>();
export const isItemRelicUnique = Flamework.createGuard<ItemRelicUnique>();

export const isItemClass = Flamework.createGuard<ItemKind>();
export const isItemId = Flamework.createGuard<ItemId>();
export const isTowerItemId = Flamework.createGuard<TowerItemId>();
export const isRelicItemId = Flamework.createGuard<RelicItemId>();

export const isItem: t.check<Item> = t.strictInterface({
	id: isItemId,
	uuid: isUUID,
	unique: t.union(isItemTowerUnique, isItemRelicUnique),
});
