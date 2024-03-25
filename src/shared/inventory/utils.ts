import { ItemClass, ItemRarity } from "shared/inventory/types";
import { Modding } from "@flamework/core";
import { createUUID } from "shared/utils/create-uuid";
import { itemDefinitions } from "./items";
import { rarityDefinitions } from "shared/inventory/rarities";
import type { Item, ItemId, ItemRelicClass, ItemTowerClass } from "shared/inventory/types";

const allItemIds = Modding.inspect<Array<ItemId>>();

export namespace ItemUtility {
	export function getRarity(): ItemRarity {
		const randomValue = math.random();
		let cumulative = 0;
		const weights = [
			rarityDefinitions[ItemRarity.Rare].weight,
			rarityDefinitions[ItemRarity.Epic].weight,
			rarityDefinitions[ItemRarity.Legendary].weight,
			rarityDefinitions[ItemRarity.Mythical].weight,
		];
		const rarities = [ItemRarity.Rare, ItemRarity.Epic, ItemRarity.Legendary, ItemRarity.Mythical];

		for (const index of $range(1, weights.size())) {
			cumulative += weights[index - 1];
			if (randomValue <= cumulative) {
				return rarities[index - 1];
			}
		}
		return ItemRarity.Rare;
	}

	export function getMultiplier(): number {
		return math.random() + 1;
	}

	export function createItem(owner: number): Item {
		const id = allItemIds[math.random(1, allItemIds.size()) - 1];
		const definition = itemDefinitions[id];
		// TS/JS moment
		const { class: kind } = definition.class;
		//
		const uuid = createUUID();
		if (kind === ItemClass.Relic) {
			const multiplier = getMultiplier();
			const props: ItemRelicClass = {
				class: ItemClass.Relic,
				multiplier,
			};
			const item: Item = {
				id,
				uuid,
				props,
			};
			return item;
		}
		const cooldown = getMultiplier();
		const damage = getMultiplier();
		const range = getMultiplier();
		const props: ItemTowerClass = {
			class: ItemClass.Tower,
			cooldown,
			damage,
			level: 0,
			locked: false,
			owner,
			range,
		};
		const item: Item = {
			id,
			uuid,
			props,
		};
		return item;
	}
}
