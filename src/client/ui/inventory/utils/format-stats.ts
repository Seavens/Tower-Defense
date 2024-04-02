import { ITEM_KIND_DISPLAYS, MOB_DAMAGE_DISPLAY } from "shared/inventory/constants";
import { ItemKind } from "shared/inventory/types";
import { itemDefinitions } from "shared/inventory/items";
import { rarityDefinitions } from "shared/inventory/rarities";
import { truncateNumber } from "shared/utils/truncate-number";
import type { Item } from "shared/inventory/types";

// function formatTargeting(targeting: Array<TowerTargeting>): string {
// 	let result = "";
// 	for (const kind of targeting) {
// 		const display = TOWER_TARGETING_DISPLAY[kind];
// 		result += `\n\t\t${display}`;
// 	}
// 	return result;
// }

export function formatStats(item: Item, size: number, owner: string): string {
	const { id, unique } = item;
	const { name: itemName, desc, rarity, kind } = itemDefinitions[id];
	const { name: rarityName, color } = rarityDefinitions[rarity];

	const base = `<font size="${size}">${itemName}</font>\n<font color="#${color.ToHex()}">${rarityName} ${
		ITEM_KIND_DISPLAYS[unique.kind]
	}</font>\n${desc}\n\nStats:\n\t`;
	if (unique.kind === ItemKind.Tower && kind.kind === ItemKind.Tower) {
		const { damage: baseDamage, range: baseRange, cooldown: baseCooldown, cost, damageKind, targeting } = kind;
		const { damage, range, cooldown, level, locked } = unique;
		return `${base}Level: ${truncateNumber(level, 0)}\n\tCost: $${truncateNumber(cost, 0)}\n\tDamage Kind: ${
			MOB_DAMAGE_DISPLAY[damageKind]
		}\n\tDamage: ${truncateNumber(baseDamage * damage, 2)}\n\tRange: ${truncateNumber(
			baseRange * range,
			2,
		)}\n\tCooldown: ${truncateNumber(baseCooldown * cooldown, 2)}\n\tLocked: ${locked}\n\tOriginal Owner: ${owner}`;
	} else if (unique.kind === ItemKind.Relic) {
		const { multiplier } = unique;
		return `${base}Multiplier: ${truncateNumber(multiplier, 2)}`;
	} else {
		return "";
	}
}

// v Includes targeting v
// return `${base}Damage: ${truncateNumber(baseDamage * damage)}\n\tRange: ${truncateNumber(baseRange * range)}\n\tCooldown: ${truncateNumber(baseCooldown * cooldown)}\n\tCost: ${truncateNumber(cost)}\n\tDamage Kind: ${MOB_DAMAGE_DISPLAY[damageKind]}\n\tTargeting:\t\t${formatTargeting(targeting)}\n\tOwner: ${truncateNumber(owner)}\n\tLevel: ${truncateNumber(level)}\n\tLocked: ${locked}`;
