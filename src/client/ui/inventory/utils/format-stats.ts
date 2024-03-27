import { ItemKind } from "shared/inventory/types";
import type { Item } from "shared/inventory/types";

export namespace FormatStats {
	export function formatStats(item: Item): Option<string> {
		if (item.props.kind === ItemKind.Tower) {
			const { damage, range, cooldown, owner, level, locked } = item.props;
			return `Damage: ${damage}\nRange: ${range}\nCooldown: ${cooldown}\nOwner: ${owner}\nLevel: ${level}\nLocked: ${locked}`;
		} else if (item.props.kind === ItemKind.Relic) {
			const { multiplier } = item.props;
			return `Multiplier: ${multiplier}`;
		} else {
			return undefined;
		}
	}
}
