import { itemDefinitions } from "shared/inventory";
import { useMemo } from "@rbxts/react";
import type { ItemKind, TowerItemId } from "shared/inventory/types";
import type { KindItemDefinition } from "shared/inventory";

export function useTowerDefintion<T extends Option<TowerItemId>>(
	id?: T,
): T extends TowerItemId ? KindItemDefinition<ItemKind.Tower> : Option<KindItemDefinition<ItemKind.Tower>>;

export function useTowerDefintion<T extends TowerItemId>(id?: Option<T>): Option<KindItemDefinition<ItemKind.Tower>> {
	const definition = useMemo((): Option<KindItemDefinition<ItemKind.Tower>> => {
		if (id === undefined) {
			return undefined;
		}
		return itemDefinitions[id];
	}, [id]);
	return definition;
}
