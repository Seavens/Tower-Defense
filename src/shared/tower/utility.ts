import { type Item, ItemClass } from "shared/item/types";
import { ItemUtility } from "shared/item/utils";
import { Modding } from "@flamework/core";
import { towerDefinitions } from "./definitions";
import type { ItemRarity } from "shared/inventory/types";
import type { TowerId } from "./types";

const allIds = Modding.inspect<Array<TowerId>>();
export namespace TowerUtility {
	export function getTowersOfRarity(rarity: ItemRarity): Array<TowerId> {
		const filtered = new Array<TowerId>();
		for (const id of allIds) {
			const definition = towerDefinitions[id];
			if (definition.rarity !== rarity) {
				id;
				continue;
			}
			filtered.push(id);
		}
		return filtered;
	}

	export function genTower(): TowerId {
		const rarity = ItemUtility.genRandomRarity();
		const towers = getTowersOfRarity(rarity);
		const index = math.random(1, towers.size());
		return towers[index - 1];
	}

	export function generateTower(owner: number): Item {
		return {
			props: {
				class: ItemClass.Tower,
				damage: ItemUtility.genMultiplier(),
				range: ItemUtility.genMultiplier(),
				cooldown: ItemUtility.genMultiplier(),
				ogOwner: owner,
				level: 1,
				locked: false,
			},
		};
	}
}
