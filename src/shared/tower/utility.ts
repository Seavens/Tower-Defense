import { ITEM_RNG_MAX, ITEM_RNG_MIN } from "shared/inventory/constants";
import { MAX_TOWER_LEVEL, SELL_RATIO, TOWER_GRADE_RANGES, TOWER_LEVEL_MULTIPLIER } from "./constants";
import { Modding } from "@flamework/core";
import { TowerGrade } from "./types";
import { itemDefinitions } from "shared/inventory";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { ReplicatedTower } from "./types";
import type { TowerAbility } from "shared/inventory/towers/abilities/types";

type TowerStat = "damage" | "range" | "cooldown";

const gradedStats = Modding.inspect<Array<TowerStat>>();

export namespace TowerUtility {
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
		const level = math.abs(1 - getLevelMultiplier(unique));
		if (upgrades === 0) {
			return base * (cooldown + level);
		}
		const cooldownMultiplier = definitions[upgrades - 1].multiplier.cooldown;
		const total = base * (cooldown + cooldownMultiplier + level);
		return total;
	}

	export function getGrade(unique: ItemTowerUnique, stat: TowerStat): TowerGrade {
		const value = unique[stat];
		const max = ITEM_RNG_MAX - ITEM_RNG_MIN;
		let alpha = (value - ITEM_RNG_MIN) / max;
		if (stat === "cooldown") {
			alpha = math.abs(1 - alpha);
		}
		let result = TowerGrade.D;
		for (const [grade, [max, min]] of pairs(TOWER_GRADE_RANGES)) {
			if (alpha <= max || alpha > min) {
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
			let alpha = (value - ITEM_RNG_MIN) / max;
			if (stat === "cooldown") {
				alpha = math.abs(1 - alpha);
			}
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

	export function calculateMultiplier(id: TowerItemId, duration: number, stat: TowerStat): number {
		const { kind } = itemDefinitions[id];
		const base = kind[stat];
		const average = (ITEM_RNG_MAX + ITEM_RNG_MIN) / 2;
		const level = TOWER_LEVEL_MULTIPLIER * (1 / MAX_TOWER_LEVEL);
		const multiplier = -average + duration / base - level;
		return multiplier;
	}

	export function isAbilityUnlocked({ id, upgrades: upgrade }: ReplicatedTower, check: TowerAbility): boolean {
		if (upgrade <= 0) {
			return false;
		}
		const { kind } = itemDefinitions[id];
		const { abilities, upgrades } = kind;
		const { ability } = upgrades[upgrade - 1];
		if (!ability || abilities === undefined || !abilities.includes(check)) {
			return false;
		}
		return !abilities.isEmpty();
	}
}
