import { ItemRarity } from "shared/inventory/types";
import { Modding } from "@flamework/core";
import { createUUID } from "shared/utils/create-uuid";
import { rarityDefinitions } from "shared/inventory/rarities";
import { t } from "@rbxts/t";
import { towerDefinitions } from "./definitions";
import type { TowerDefinition } from "./definitions";
import type { TowerId, TowerObject } from "./types";

const isRange = t.strictArray(t.number, t.number);
const allIds = Modding.inspect<Array<TowerId>>();

export function generateTowerObject(owner: number): TowerObject {
	function getTowersOfRarity(rarity: ItemRarity): Array<TowerId> {
		const filtered = new Array<TowerId>();
		for (const id of allIds) {
			const definition = towerDefinitions[id];
			if (definition.rarity !== rarity) {
				continue;
			}
			filtered.push(id);
		}
		return filtered;
	}

	function genRandomRarity(): ItemRarity {
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

	function genTower(): TowerId {
		const rarity = genRandomRarity();
		const towers = getTowersOfRarity(rarity);
		const index = math.random(1, towers.size());
		return towers[index - 1];
	}

	function genFromRange(towerId: TowerId, key: keyof TowerDefinition<TowerId>): number {
		const tower = towerDefinitions[towerId];
		const value = tower[key];
		if (!isRange(value)) {
			return 0;
		}
		const [min, max] = value;
		const generated = math.random() * (max - min) + min;
		return generated;
	}

	const id = genTower();
	const uuid = createUUID();
	const range = genFromRange(id, "range");
	const damage = genFromRange(id, "damage");
	const attackSpeed = genFromRange(id, "cooldown");
	const level = 1;

	return {
		id,
		owner,
		original: owner,
		range: range,
		damage: damage,
		cooldown: attackSpeed,
		uuid,
		timestamp: DateTime.now().ToIsoDate(),
		level: level,
		// cost: TowerDefinitions[id].cost * (level * LEVEL_TOWER_GROWTH_RATE),
		cost: towerDefinitions[id].cost,
		locked: false,
	};
}
