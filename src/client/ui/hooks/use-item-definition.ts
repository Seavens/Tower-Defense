import { itemDefinitions } from "shared/inventory/items";
import { useMemo } from "@rbxts/react";
import type { AnyItemDefinition, ItemDefinition } from "shared/inventory/items";
import type { ItemId, ItemKind } from "shared/inventory/types";

export function useItemDefinition(id?: ItemId): Option<AnyItemDefinition> {
	return useMemo((): Option<AnyItemDefinition> => {
		if (id === undefined) return undefined;
		return itemDefinitions[id];
	}, [id]);
}
