import { PALETTE } from "client/ui/constants";
import Abbreviator from "@rbxts/abbreviate";
import type { ItemKind, ItemTowerUnique } from "shared/inventory/types";
import type { KindItemDefinition, TowerUpgradeInfo } from "shared/inventory/items";

const abbreviator = new Abbreviator();

export function formatUpgrade(currentUpgrade: TowerUpgradeInfo, nextUpgrade: Option<TowerUpgradeInfo>): string {
	const [index] = currentUpgrade;
	if (nextUpgrade === undefined) {
		return `Upgrade [${index}]: MAX`;
	}
	const [_, [multiplier]] = nextUpgrade;
	return `Upgrade [${index}] → [<font color="#${PALETTE.positive}">+${multiplier}x</font>]`;
}

export function formatCost(nextUpgrade: Option<TowerUpgradeInfo>): string {
	if (nextUpgrade === undefined) {
		return "MAX";
	}
	const [_1, _2, cost] = nextUpgrade;
	return `Upgrade: $${abbreviator.numberToString(cost)}`;
}

export function formatRange(
	unique: ItemTowerUnique,
	definition: KindItemDefinition<ItemKind.Tower>,
	currentUpgrade: TowerUpgradeInfo,
	nextUpgrade: Option<TowerUpgradeInfo>,
): string {
	const { range } = unique;
	const { kind } = definition;
	const { range: base } = kind;
	const [_1, currentMultiplier] = currentUpgrade;
	const currentRange = base * range * currentMultiplier[1];
	let text = `Range: ${abbreviator.numberToString(currentRange)}`;
	if (nextUpgrade === undefined) {
		return text;
	}
	const [_2, nextMultiplier] = nextUpgrade;
	const nextRange = base * range * nextMultiplier[0];
	const increased = nextRange > currentRange;
	text += `→ [<font color="#${increased ? PALETTE.positive : PALETTE.negative}">${abbreviator.numberToString(nextRange)}</font>]`;
	return text;
}

export function formatDamage(
	unique: ItemTowerUnique,
	definition: KindItemDefinition<ItemKind.Tower>,
	currentUpgrade: TowerUpgradeInfo,
	nextUpgrade: Option<TowerUpgradeInfo>,
): string {
	const { damage } = unique;
	const { kind } = definition;
	const { damage: base } = kind;
	const [_1, currentMultiplier] = currentUpgrade;
	const currentDamage = base * damage * currentMultiplier[0];
	let text = `Damage: ${abbreviator.numberToString(currentDamage)}`;
	if (nextUpgrade === undefined) {
		return text;
	}
	const [_2, nextMultiplier] = nextUpgrade;
	const nextDamage = base * damage * nextMultiplier[0];
	const increased = nextDamage > currentDamage;
	text += `→ [<font color="#${increased ? PALETTE.positive : PALETTE.negative}">${abbreviator.numberToString(nextDamage)}</font>]`;
	return text;
}

export function formatCooldown(
	unique: ItemTowerUnique,
	definition: KindItemDefinition<ItemKind.Tower>,
	currentUpgrade: TowerUpgradeInfo,
	nextUpgrade: Option<TowerUpgradeInfo>,
): string {
	const { cooldown } = unique;
	const { kind } = definition;
	const { cooldown: base } = kind;
	const [_1, currentMultiplier] = currentUpgrade;
	const currentCooldown = base * cooldown * currentMultiplier[2];
	let text = `Cooldown: ${abbreviator.numberToString(currentCooldown)}`;
	if (nextUpgrade === undefined) {
		return text;
	}
	const [_2, nextMultiplier] = nextUpgrade;
	const nextCooldown = base * cooldown * nextMultiplier[2];
	const increased = nextCooldown > currentCooldown;
	text += `→ [<font color="#${increased ? PALETTE.negative : PALETTE.positive}">${abbreviator.numberToString(nextCooldown)}</font>]`;
	return text;
}
