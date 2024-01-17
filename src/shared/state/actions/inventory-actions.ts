import type { DataActions } from "./data-actions";
import type { EntityMetadata, ReplicationMetadata } from "../metadata";
import type { Item } from "shared/types/objects";

export type InventoryActions<S> = {
	inventoryAddItem: (state: S, payload: InventoryAddItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryRemoveItem: (state: S, payload: InventoryRemoveItem, metadata: EntityMetadata & ReplicationMetadata) => S;
} & DataActions<S>;

export interface InventoryAddItem {
	item: Item;
	slot: string;
}

export interface InventoryRemoveItem {
	slot: string;
}
