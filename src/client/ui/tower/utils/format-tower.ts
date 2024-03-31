import { PALETTE } from "client/ui/constants";
import { TowerUtil } from "shared/tower/util";
import { itemDefinitions } from "shared/inventory/items";
import Abbreviator from "@rbxts/abbreviate";
import type { ItemKind, ItemTowerUnique } from "shared/inventory/types";
import type { KindItemDefinition, TowerUpgradeInfo } from "shared/inventory/items";
import type { ReplicatedTower } from "shared/tower/types";

const abbreviator = new Abbreviator();

export function formatUpgrade(replicated: ReplicatedTower): string {
	const { id, upgrades } = replicated;
	const { kind } = itemDefinitions[id];
	const { upgrades: definitions } = kind;
	if (upgrades >= definitions.size()) {
		return `Upgrade [${upgrades}]: MAX`;
	}
	// roblox-ts assumes we're using 0 based indices, so we don't need a + 1.
	const [index] = definitions[upgrades];
	return `Upgrade [${upgrades}] → [<font color="#${PALETTE.positive}">${index}</font>]`;
}

export function formatRange(replicated: ReplicatedTower): string {
	const currentRange = TowerUtil.getTotalRange(replicated);
	const nextRange = TowerUtil.getTotalRange({ ...replicated, upgrades: replicated.upgrades + 1 });
	let text = `Range: ${abbreviator.numberToString(currentRange)}`;
	if (nextRange >= math.huge) {
		return text;
	}
	const increased = nextRange > currentRange;
	text += `→ [<font color="#${increased ? PALETTE.positive : PALETTE.negative}">${abbreviator.numberToString(nextRange)}</font>]`;
	return text;
}

export function formatDamage(replicated: ReplicatedTower): string {
	const currentDamage = TowerUtil.getTotalDamage(replicated);
	const nextDamage = TowerUtil.getTotalDamage({ ...replicated, upgrades: replicated.upgrades + 1 });
	let text = `Damage: ${abbreviator.numberToString(currentDamage)}`;
	if (nextDamage >= math.huge) {
		return text;
	}
	const increased = nextDamage > currentDamage;
	text += `→ [<font color="#${increased ? PALETTE.positive : PALETTE.negative}">${abbreviator.numberToString(nextDamage)}</font>]`;
	return text;
}

export function formatCooldown(replicated: ReplicatedTower): string {
	const currentCooldown = TowerUtil.getTotalCooldown(replicated);
	const nextCooldown = TowerUtil.getTotalCooldown({ ...replicated, upgrades: replicated.upgrades + 1 });
	let text = `Cooldown: ${abbreviator.numberToString(currentCooldown)}`;
	if (nextCooldown >= math.huge) {
		return text;
	}
	const increased = nextCooldown > currentCooldown;
	text += `→ [<font color="#${increased ? PALETTE.negative : PALETTE.positive}">${abbreviator.numberToString(nextCooldown)}</font>]`;
	return text;
}
