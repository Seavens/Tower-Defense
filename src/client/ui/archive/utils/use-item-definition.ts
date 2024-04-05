import { itemDefinitions } from "shared/inventory/items";
import { useMemo } from "@rbxts/react";
import type { AnyItemDefinition } from "shared/inventory/items";
import type { ItemId } from "shared/inventory/types";

export function useItemDefinition(id: Option<ItemId>): Option<AnyItemDefinition> {
	const definition = useMemo((): Option<AnyItemDefinition> => {
		if (id === undefined) {
			return undefined;
		}
		return itemDefinitions[id];
	}, [id]);
	return definition;
}
