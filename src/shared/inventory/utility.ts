import { ITEM_RNG_MAX, ITEM_RNG_MIN } from "./constants";
import { ItemKind } from "shared/inventory/types";
import { MAX_TOWER_LEVEL } from "shared/tower/constants";
import { Modding } from "@flamework/core";
import { RarityUtility } from "./rarities/utility";
import { TowerUtility } from "./towers/utility";
import { createUUID } from "shared/utility/functions/create-uuid";
import { itemDefinitions } from ".";
import type {
	Item,
	ItemId,
	ItemRelicUnique,
	ItemTowerUnique,
	ItemUnique,
	RelicItemId,
	TowerItemId,
} from "shared/inventory/types";

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

		// !! Change when done
		const unique: ItemTowerUnique = {
			kind: ItemKind.Tower,
			cooldown,
			damage,
			level: math.random(1, 100),
			experience: math.random(1, 1000),
			locked: math.random() > 0.5 ? true : false,
			owner: math.random(1, 100),
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

	export function getItemValue(id: ItemId, unique: ItemUnique): number {
		const { kind } = unique;
		const { value } = itemDefinitions[id];
		if (kind === ItemKind.Relic) {
			const { multiplier } = unique;
			const alpha = (multiplier - ITEM_RNG_MIN) / (ITEM_RNG_MAX - ITEM_RNG_MIN);
			return value * alpha;
		}
		const { cooldown, damage, range, level } = unique;
		const cooldownMultiplier = math.abs(1 - (cooldown - ITEM_RNG_MIN) / (ITEM_RNG_MAX - ITEM_RNG_MIN));
		const damageMultiplier = (damage - ITEM_RNG_MIN) / (ITEM_RNG_MAX - ITEM_RNG_MIN);
		const rangeMultiplier = (range - ITEM_RNG_MIN) / (ITEM_RNG_MAX - ITEM_RNG_MIN);
		const levelMultiplier = (level - 1) / (MAX_TOWER_LEVEL - 1);
		const alpha = (cooldownMultiplier + damageMultiplier + rangeMultiplier + levelMultiplier) / 4;
		return value * alpha;
	}
}
