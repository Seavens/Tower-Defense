import type {} from "shared/tower/types";
import type { DataActions } from "shared/data/actions";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { Item } from "./types";

export type InventoryActions<S> = {
	inventoryAddItem: (state: S, payload: InventoryAddItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryRemoveItem: (state: S, payload: InventoryRemoveItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryEquipItem: (state: S, payload: InventoryEquipItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryUnequipItem: (
		state: S,
		payload: InventoryUnequipItem,
		metadata: EntityMetadata & ReplicationMetadata,
	) => S;
} & DataActions<S>;

export interface InventoryAddItem {
	items: Array<Item>;
}

export interface InventoryRemoveItem {
	slots: Array<Slot>;
}

export interface InventoryEquipItem {
	items: Array<Item>;
}

export interface InventoryUnequipItem {
	slots: Array<Slot>;
}
