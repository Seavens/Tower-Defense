import { Flamework } from "@flamework/core";
import { isUUID } from "shared/guards";
import { t } from "@rbxts/t";

export const enum ItemRarity {
	Rare = "rarity_id:rare",
	Epic = "rarity_id:epic",
	Legendary = "rarity_id:legendary",
	Mythical = "rarity_id:mythical",
	Secret = "rarity_id:secret",
}

export const enum ItemClass {
	Tower = "item_kind:tower",
	Relic = "item_kind:relic",
}

export const enum ItemId {
	Sniper = "item_id:sniper",
	Melee = "item_id:melee",
	Blunt = "item_id:blunt",
	God = "item_id:god",
	Chalice = "item_id:chalice",
}

export interface ItemTowerClass {
	class: ItemClass.Tower;
	damage: number;
	range: number;
	cooldown: number;
	owner: number;
	level: number;
	locked: boolean;
}

export interface ItemRelicClass {
	class: ItemClass.Relic;
	multiplier: number;
}

export interface ItemClasses {
	[ItemClass.Tower]: ItemTowerClass;
	[ItemClass.Relic]: ItemRelicClass;
}

export interface Item {
	id: ItemId;
	uuid: UUID;
	// timestamp: number;
	props: ItemClasses[ItemClass];
}

export const isItemRarity = Flamework.createGuard<ItemRarity>();
export const isItemTowerClass = Flamework.createGuard<ItemTowerClass>();
export const isItemRelicClass = Flamework.createGuard<ItemRelicClass>();

export const isItemClass = Flamework.createGuard<ItemClass>();
export const isItemId = Flamework.createGuard<ItemId>();

export const isItem: t.check<Item> = t.strictInterface({
	id: isItemId,
	uuid: isUUID,
	props: t.union(isItemTowerClass, isItemRelicClass),
});
