import type {} from "shared/tower/types";
import type { DataActions } from "shared/data/actions";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { Item } from "./types";

export type InventoryActions<S> = {
	inventoryAddItem: (state: S, payload: InventoryAddItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryAddItems: (state: S, payload: InventoryAddItems, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryRemoveItem: (state: S, payload: InventoryRemoveItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryRemoveItems: (
		state: S,
		payload: InventoryRemoveItems,
		metadata: EntityMetadata & ReplicationMetadata,
	) => S;
	inventoryEquipItem: (state: S, payload: InventoryEquipItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryEquipItems: (state: S, payload: InventoryEquipItems, metadata: EntityMetadata & ReplicationMetadata) => S;
} & DataActions<S>;

export interface InventoryAddItem {
	item: Item;
	slot: Slot;
}

export interface InventoryAddItems {
	items: Array<Item>;
}

export interface InventoryRemoveItem {
	slot: Slot;
}

export interface InventoryRemoveItems {
	slots: Array<Slot>;
}

export interface InventoryEquipItem {
	item: Item;
	slot: Slot;
}

export interface InventoryEquipItems {
	items: Array<Item>;
}
