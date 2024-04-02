import { ITEM_RNG_MAX, ITEM_RNG_MIN } from "shared/inventory/constants";
import { MAX_TOWER_LEVEL, SELL_RATIO, TOWER_GRADE_RANGES, TOWER_LEVEL_MULTIPLIER } from "./constants";
import { Modding } from "@flamework/core";
import { TowerGrade } from "./types";
import { itemDefinitions } from "shared/inventory/items";
import type { ItemTowerUnique } from "shared/inventory/types";
import type { ReplicatedTower } from "./types";

type TowerGradedStats = "damage" | "range" | "cooldown";

const gradedStats = Modding.inspect<Array<TowerGradedStats>>();

export namespace TowerUtil {
	export function getUpgradeCost(tower: ReplicatedTower): number {
		const { id, upgrades } = tower;
		const { kind } = itemDefinitions[id];
		const { upgrades: definitions } = kind;
		const upgrade = definitions[upgrades];
		if (upgrade === undefined) {
			return math.huge;
		}
		const { cost } = upgrade;
		return cost;
	}

	export function getSellPrice(tower: ReplicatedTower): number {
		const { id, upgrades } = tower;
		const { kind } = itemDefinitions[id];
		const { upgrades: definitions } = kind;
		let { cost } = kind;
		for (const index of $range(1, upgrades)) {
			const price = definitions[index - 1].cost;
			cost += price * SELL_RATIO;
		}
		return cost * SELL_RATIO;
	}

	export function getTotalDamage(tower: ReplicatedTower): number {
		const { id, upgrades, unique } = tower;
		const { damage } = unique;
		const { kind } = itemDefinitions[id];
		const { upgrades: definitions, damage: base } = kind;
		if (upgrades > definitions.size()) {
			return math.huge;
		}
		const level = getLevelMultiplier(unique);
		if (upgrades === 0) {
			return base * (damage + level);
		}
		const damageMultiplier = definitions[upgrades - 1].multiplier.damage;
		const total = base * (damage + damageMultiplier + level);
		return total;
	}

	export function getTotalRange(tower: ReplicatedTower): number {
		const { id, unique, upgrades } = tower;
		const { range } = unique;
		const { kind } = itemDefinitions[id];
		const { upgrades: definitions, range: base } = kind;
		if (upgrades > definitions.size()) {
			return math.huge;
		}
		const level = getLevelMultiplier(unique);
		if (upgrades === 0) {
			return base * (range + level);
		}
		const rangeMultiplier = definitions[upgrades - 1].multiplier.range;
		const total = base * (range + rangeMultiplier + level);
		return total;
	}

	export function getTotalCooldown(tower: ReplicatedTower): number {
		const { id, upgrades, unique } = tower;
		const { cooldown } = unique;
		const { kind } = itemDefinitions[id];
		const { upgrades: definitions, cooldown: base } = kind;
		if (upgrades > definitions.size()) {
			return math.huge;
		}
		const level = getLevelMultiplier(unique);
		if (upgrades === 0) {
			return base * (cooldown + level);
		}
		const cooldownMultiplier = definitions[upgrades - 1].multiplier.cooldown;
		const total = base * (cooldown + cooldownMultiplier + level);
		return total;
	}

	export function getGrade(unique: ItemTowerUnique, stat: TowerGradedStats): TowerGrade {
		const value = unique[stat];
		const max = ITEM_RNG_MAX - ITEM_RNG_MIN;
		const alpha = (value - ITEM_RNG_MIN) / max;
		let result = TowerGrade.D;
		for (const [grade, [max, min]] of pairs(TOWER_GRADE_RANGES)) {
			if (alpha <= min || alpha > max) {
				continue;
			}
			result = grade;
			break;
		}
		return result;
	}

	export function getOverallGrade(unique: ItemTowerUnique): TowerGrade {
		let total = 0;
		for (const stat of gradedStats) {
			const value = unique[stat];
			const max = ITEM_RNG_MAX - ITEM_RNG_MIN;
			const alpha = (value - ITEM_RNG_MIN) / max;
			total += alpha;
		}
		total /= 3;
		let result = TowerGrade.D;
		for (const [grade, [max, min]] of pairs(TOWER_GRADE_RANGES)) {
			if (total <= min || total > max) {
				continue;
			}
			result = grade;
			break;
		}
		return result;
	}

	export function getLevelMultiplier(unique: ItemTowerUnique): number {
		const { level } = unique;
		return TOWER_LEVEL_MULTIPLIER * (level / MAX_TOWER_LEVEL);
	}
}
