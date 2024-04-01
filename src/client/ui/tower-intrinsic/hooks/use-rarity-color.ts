import { rarityDefinitions } from "shared/inventory/rarities";
import { useMemo } from "@rbxts/react";
import type { AnyRarityDefinition } from "shared/inventory/rarities";
import type { ItemRarity } from "shared/inventory/types";

export function useRarityColor(rarity: ItemRarity): Color3 {
	const { color } = useMemo((): AnyRarityDefinition => {
		return rarityDefinitions[rarity];
	}, [rarity]);
	return color;
}
