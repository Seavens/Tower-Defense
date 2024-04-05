import { PALETTE } from "client/ui/constants";
import { TowerUtility } from "shared/tower/utility";
import { itemDefinitions } from "shared/inventory/items";
import Abbreviator from "@rbxts/abbreviate";
import type { ReplicatedTower } from "shared/tower/types";

const abbreviator = new Abbreviator();

export function formatUpgrade(replicated: ReplicatedTower): string {
	const { id, upgrades } = replicated;
	const { kind } = itemDefinitions[id];
	const { upgrades: definitions } = kind;
	if (upgrades >= definitions.size()) {
		return `MAX`;
	}
	const index = definitions[upgrades].upgrade;
	return `[${upgrades}] → [<font color="#${PALETTE.positive}">${index}</font>]`;
}

export function formatRange(replicated: ReplicatedTower): string {
	const currentRange = TowerUtility.getTotalRange(replicated);
	const { upgrades } = replicated;
	const nextRange = TowerUtility.getTotalRange({ ...replicated, upgrades: upgrades + 1 });
	let text = `${abbreviator.numberToString(currentRange)}`;
	if (nextRange >= math.huge) {
		return text;
	}
	const increased = nextRange > currentRange;
	text += ` → [<font color="#${increased ? PALETTE.positive : PALETTE.negative}">${abbreviator.numberToString(nextRange)}</font>]`;
	return text;
}

export function formatDamage(replicated: ReplicatedTower): string {
	const currentDamage = TowerUtility.getTotalDamage(replicated);
	const nextDamage = TowerUtility.getTotalDamage({ ...replicated, upgrades: replicated.upgrades + 1 });
	let text = `${abbreviator.numberToString(currentDamage)}`;
	if (nextDamage >= math.huge) {
		return text;
	}
	const increased = nextDamage > currentDamage;
	text += ` → [<font color="#${increased ? PALETTE.positive : PALETTE.negative}">${abbreviator.numberToString(nextDamage)}</font>]`;
	return text;
}

export function formatCooldown(replicated: ReplicatedTower): string {
	const currentCooldown = TowerUtility.getTotalCooldown(replicated);
	const nextCooldown = TowerUtility.getTotalCooldown({ ...replicated, upgrades: replicated.upgrades + 1 });
	let text = `${abbreviator.numberToString(currentCooldown)}`;
	if (nextCooldown >= math.huge) {
		return text;
	}
	const increased = nextCooldown > currentCooldown;
	text += ` → [<font color="#${increased ? PALETTE.negative : PALETTE.positive}">${abbreviator.numberToString(nextCooldown)}</font>]`;
	return text;
}
