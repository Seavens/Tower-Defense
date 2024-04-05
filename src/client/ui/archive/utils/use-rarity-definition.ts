// import { itemDefinitions } from "shared/inventory/items";
// import { rarityDefinitions } from "shared/inventory/rarities";
// import { useMemo } from "@rbxts/react";
// import type { AnyRarityDefinition } from "shared/inventory/rarities";
// import type { ItemId } from "shared/inventory/types";

// export function useRarityDefinition(id: Option<ItemId>): Option<AnyRarityDefinition> {
// 	const rarity = useMemo((): Option<AnyRarityDefinition> => {
// 		if (id === undefined) {
// 			return undefined;
// 		}
// 		const definition = itemDefinitions[id];
// 		if (definition === undefined) {
// 			return undefined;
// 		}
// 		const { rarity } = definition;
// 		return rarityDefinitions[rarity];
// 	}, [id]);
// 	return rarity;
// }
