import type { DataActions } from "shared/data/actions";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { TowerObject } from "shared/tower/types";

export type InventoryActions<S> = {
	inventoryAddItem: (state: S, payload: InventoryAddItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryRemoveItem: (state: S, payload: InventoryRemoveItem, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryEquipItem: (state: S, payload: InventoryEquipItem, metadata: EntityMetadata & ReplicationMetadata) => S;
} & DataActions<S>;

export interface InventoryAddItem {
	item: TowerObject;
	slot: string;
}

export interface InventoryRemoveItem {
	slot: string;
}

export interface InventoryEquipItem {
	item: TowerObject;
	slot: string;
}
