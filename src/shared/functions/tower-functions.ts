import { LEVEL_TOWER_GROWTH_RATE } from "shared/constants/level-constants";
import { Modding } from "@flamework/core";
import { RarityDefinitions } from "shared/definitions/rarities";
import { RarityId } from "shared/types/ids/rarity-id";
import { TowerDefinitions } from "shared/definitions/towers";
import { generateUUID } from "./generate-uuid";
import { t } from "@rbxts/t";
import type { TowerDefinition } from "shared/types/definitions";
import type { TowerId } from "shared/types/ids";
import type { TowerObject } from "shared/types/objects";

const isRange = t.strictArray(t.number, t.number);

export function GenerateTowerObject(owner: number): TowerObject {
	function getTowersOfRarity(rarity: RarityId): Array<TowerId> {
		const allIds = Modding.inspect<Array<TowerId>>();
		const filtered = new Array<TowerId>();
		for (const id of allIds) {
			const definition = TowerDefinitions[id];
			if (definition.rarity !== rarity) {
				continue;
			}
			filtered.push(id);
		}
		return filtered;
	}

	function genRandomRarity(): RarityId {
		const randomValue = math.random();
		let cumulative = 0;
		const weights = [
			RarityDefinitions[RarityId.Rare].weight,
			RarityDefinitions[RarityId.Epic].weight,
			RarityDefinitions[RarityId.Legendary].weight,
			RarityDefinitions[RarityId.Mythical].weight,
		];
		const rarities = [RarityId.Rare, RarityId.Epic, RarityId.Legendary, RarityId.Mythical];

		for (const index of $range(1, weights.size())) {
			cumulative += weights[index - 1];
			if (randomValue <= cumulative) {
				return rarities[index - 1];
			}
		}

		return RarityId.Rare;
	}

	function genTower(): TowerId {
		const rarity = genRandomRarity();
		const towers = getTowersOfRarity(rarity);
		const index = math.random(1, towers.size());
		return towers[index - 1];
	}

	function genFromRange(towerId: TowerId, key: keyof TowerDefinition<TowerId>): number {
		const tower = TowerDefinitions[towerId];
		const value = tower[key];
		if (!isRange(value)) {
			return 0;
		}
		const [min, max] = value;
		const generated = math.random() * (max - min) + min;
		return generated;
	}

	const id = genTower();
	const uuid = generateUUID();
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
		cost: TowerDefinitions[id].startCost * (level * LEVEL_TOWER_GROWTH_RATE),
		locked: false,
	};
}
