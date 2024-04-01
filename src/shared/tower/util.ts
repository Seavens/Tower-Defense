import { SELL_RATIO } from "./constants";
import { itemDefinitions } from "shared/inventory/items";
import type { ReplicatedTower } from "./types";

export namespace TowerUtil {
	export function getUpgradeCost(tower: ReplicatedTower): number {
		const { id, upgrades } = tower;
		const { kind } = itemDefinitions[id];
		const { upgrades: definitions } = kind;
		// We don't have to -1 since roblox-ts does it for us,
		// thinking we're using 0 based indices.
		const upgrade = definitions[upgrades];
		if (upgrade === undefined) {
			return math.huge;
		}
		const [, , cost] = upgrade;
		return cost;
	}

	export function getSellPrice(tower: ReplicatedTower): number {
		const { id, upgrades } = tower;
		const { kind } = itemDefinitions[id];
		const { upgrades: definitions } = kind;
		let { cost } = kind;
		for (const index of $range(1, upgrades)) {
			const [, , price] = definitions[index - 1];
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
		const [_, { damage: multiplier }] = definitions[upgrades - 1];
		const total = base * damage * multiplier;
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
		const [_, { range: multiplier }] = definitions[upgrades - 1];
		const total = range * base * multiplier;
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
		const [_, { cooldown: multiplier }] = definitions[upgrades - 1];
		const total = base * cooldown * multiplier;
		return total;
	}
}
