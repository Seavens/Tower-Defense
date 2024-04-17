import { itemDefinitions } from "shared/inventory";
import { useMemo } from "@rbxts/react";
import type { AnyItemDefinition } from "shared/inventory";
import type { ItemId } from "shared/inventory/types";

export function useItemDefinition(id?: ItemId): Option<AnyItemDefinition> {
	return useMemo((): Option<AnyItemDefinition> => {
		if (id === undefined) return undefined;
		return itemDefinitions[id];
	}, [id]);
}
