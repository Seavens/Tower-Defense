import type {} from "shared/tower/types";
import type { DataActions } from "shared/data/actions";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { Item, ItemUnique } from "./types";

export type InventoryActions<S> = {
	inventoryAddItems: (state: S, payload: InventoryAddItems, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryRemoveItems: (
		state: S,
		payload: InventoryRemoveItems,
		metadata: EntityMetadata & ReplicationMetadata,
	) => S;
	inventoryEquipSlot: (state: S, payload: InventoryEquipSlot, metadata: EntityMetadata & ReplicationMetadata) => S;
	inventoryUnequipSlot: (
		state: S,
		payload: InventoryUnequipSlot,
		metadata: EntityMetadata & ReplicationMetadata,
	) => S;
	inventoryPatchSlot: (state: S, payload: InventoryPatchSlot, metadata: EntityMetadata & ReplicationMetadata) => S;
} & DataActions<S>;

export interface InventoryAddItems {
	items: Array<Item>;
}

export interface InventoryRemoveItems {
	slots: Array<Slot>;
}

export interface InventoryEquipSlot {
	slot: Slot;
}

export interface InventoryUnequipSlot {
	slot: Slot;
}

export interface InventoryPatchSlot {
	slot: Slot;
	patch: Partial<ItemUnique>;
}

export interface InventorySellItem {
	slot: Slot;
}
