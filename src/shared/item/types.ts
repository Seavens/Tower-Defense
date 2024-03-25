import { Flamework } from "@flamework/core";
import { t } from "@rbxts/t";

export const enum ItemClass {
	Tower = "item_kind:tower",
	Relic = "item_kind:relic",
}

export const enum ItemId {
	Sniper = "item_id:sniper",
	Melee = "item_id:meele",
	Blunt = "item_id:blunt",
	God = "item_id:god",
	Chalice = "item_id:chalice",
}

interface ItemTowerClass {
	class: ItemClass.Tower;
	damage: number;
	range: number;
	cooldown: number;
	ogOwner: number;
	level: number;
	locked: boolean;
}

interface ItemRelicClass {
	class: ItemClass.Relic;
	multiplier: number;
}

export interface ItemClasses {
	[ItemClass.Tower]: ItemTowerClass;
	[ItemClass.Relic]: ItemRelicClass;
}

export interface Item {
	id: ItemId;
	uuid: string;
	timestamp: string;
	props: ItemClasses[ItemClass];
}

export const isItemTowerClass = Flamework.createGuard<ItemTowerClass>();
export const isItemRelicClass = Flamework.createGuard<ItemRelicClass>();

export const isItemClass = Flamework.createGuard<ItemClass>();
export const isItemId = Flamework.createGuard<ItemId>();

export const isItem: t.check<Item> = t.strictInterface({
	id: isItemId,
	uuid: t.string,
	timestamp: t.string,
	props: t.union(isItemTowerClass, isItemRelicClass),
});
