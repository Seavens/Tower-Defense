import { ITEM_RNG_MAX, ITEM_RNG_MIN } from "./constants";
import { ItemKind, ItemRarity } from "shared/inventory/types";
import { Modding } from "@flamework/core";
import { RarityUtility } from "./rarities/utils";
import { TowerUtility } from "./items/towers/utility";
import { createUUID } from "shared/utils/create-uuid";
import { itemDefinitions } from "./items";
import { rarityDefinitions } from "shared/inventory/rarities";
import type { Item, ItemId, ItemRelicUnique, ItemTowerUnique, RelicItemId, TowerItemId } from "shared/inventory/types";

const allItemIds = Modding.inspect<Array<ItemId>>();
const towerItemIds = Modding.inspect<Array<TowerItemId>>();
const relicItemIds = Modding.inspect<Array<RelicItemId>>();
const mappedItemIds = {
	[ItemKind.Tower]: towerItemIds,
	[ItemKind.Relic]: relicItemIds,
};

export namespace ItemUtility {
	export function createItem<T extends Option<ItemKind>>(owner: number, kind?: T): Item;

	export function createItem<T extends Option<ItemKind>>(
		owner: number,
		kind: T,
	): T extends ItemKind.Tower ? ItemTowerUnique : Item;
	export function createItem<T extends Option<ItemKind>>(
		owner: number,
		kind: T,
	): T extends ItemKind.Relic ? ItemRelicUnique : Item;

	export function createItem<T extends Option<ItemKind>>(owner: number, kind?: T): Item {
		let id: ItemId;
		if (kind !== undefined) {
			const rarity = RarityUtility.getRarity();
			const ids = mappedItemIds[kind];
			const filteredIds = ids.filter(
				(id) => itemDefinitions[id].rarity === rarity && itemDefinitions[id].kind.kind === kind,
			);
			id = filteredIds[math.random(1, filteredIds.size()) - 1];
		} else {
			id = allItemIds[math.random(1, allItemIds.size()) - 1];
		}
		const definition = itemDefinitions[id];
		const { kind: itemKind } = definition.kind;
		const uuid = createUUID();
		if (itemKind === ItemKind.Relic) {
			const multiplier = TowerUtility.getMultiplier();
			const unique: ItemRelicUnique = {
				kind: ItemKind.Relic,
				multiplier,
				locked: false,
			};
			const item: Item = {
				id,
				uuid,
				unique,
			};
			return item;
		}
		const cooldown = TowerUtility.getMultiplier();
		const damage = TowerUtility.getMultiplier();
		const range = TowerUtility.getMultiplier();

		// !! CHANGE AFTER TESTING
		const unique: ItemTowerUnique = {
			kind: ItemKind.Tower,
			cooldown,
			damage,
			level: math.random(1, 100),
			experience: math.random(1, 10000),
			locked: math.random() < 0.5 ? true : false,
			owner,
			range,
		};
		const item: Item = {
			id,
			uuid,
			unique,
		};
		return item;
	}

	export function createItems<T extends Option<ItemKind>>(owner: number, count: number, kind?: T): Array<Item>;

	export function createItems<T extends Option<ItemKind>>(
		owner: number,
		count: number,
		kind: T,
	): T extends ItemKind.Tower ? Array<ItemTowerUnique> : Array<Item>;
	export function createItems<T extends Option<ItemKind>>(
		owner: number,
		count: number,
		kind: T,
	): T extends ItemKind.Relic ? Array<ItemRelicUnique> : Array<Item>;

	export function createItems<T extends Option<ItemKind>>(owner: number, count: number, kind?: T): Array<Item> {
		const items = new Array<Item>();
		for (const _ of $range(1, count)) {
			const item = createItem(owner, kind);
			items.push(item);
		}
		return items;
	}

	export function getAllItemNames(): Array<string> {
		const names = new Array<string>();
		for (const id of allItemIds) {
			const { name } = itemDefinitions[id];
			names.push(name);
		}
		return names;
	}
}
