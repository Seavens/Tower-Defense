import { type BindingOrValue, mapBinding } from "@rbxts/pretty-react-hooks";
import { ItemKind } from "shared/inventory/types";
import { MOB_DAMAGE_DISPLAY } from "shared/inventory/constants";
import { itemDefinitions } from "shared/inventory/items";
import { rarityDefinitions } from "shared/inventory/rarities";
import { truncateNumber } from "shared/utility/functions/truncate-number";
import type { Binding } from "@rbxts/react";
import type { Item } from "shared/inventory/types";

export function formatStats(
	item: Item,
	color: BindingOrValue<Color3>,
	size: number,
	owner: string,
): Option<Binding<string>> {
	const { id, unique } = item;
	const { name: itemName, desc, rarity, kind } = itemDefinitions[id];
	const { name: rarityName } = rarityDefinitions[rarity];
	if (unique.kind === ItemKind.Tower && kind.kind === ItemKind.Tower) {
		const { cost, damageKind } = kind;
		const { damage, range, cooldown, level, locked } = unique;
		const { damage: baseDamage, cooldown: baseCooldown, range: baseRange } = kind;
		return mapBinding(
			color,
			(value: Color3): string =>
				`<font size="${size}">${itemName}</font>\n<font color="#${value.ToHex()}">${rarityName}</font>\n${desc}\n\nLevel: ${truncateNumber(level, 0)}\nCost: ${truncateNumber(cost, 0)}\nDamage: ${truncateNumber(baseDamage * damage, 3)}\nRange: ${truncateNumber(baseRange * range, 2)}\nCooldown: ${truncateNumber(baseCooldown * cooldown, 2)}\nLocked: ${locked ? "Yes" : "No"}\nDamage Kind: ${MOB_DAMAGE_DISPLAY[damageKind]}\nCreator: ${owner}`,
		);
	} else if (unique.kind === ItemKind.Relic) {
		const { multiplier } = unique;
		return mapBinding(
			color,
			(value: Color3): string =>
				`<font size="${size}">${itemName}</font>\n<font color="#${value.ToHex()}">${rarityName}</font>\n${desc}\n\nMultiplier: ${truncateNumber(multiplier, 2)}\n`,
		);
	} else {
		return undefined;
	}
}
