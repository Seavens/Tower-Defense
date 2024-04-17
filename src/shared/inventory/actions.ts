import type {} from "shared/tower/types";
import type { DataActions } from "shared/players/data/actions";
import type { Item, ItemUnique } from "./types";
import type { ReplicationMetadata, UserMetadata } from "shared/state/replication/metadata";

export type InventoryActions<S> = {
	inventoryAddItems: (state: S, payload: InventoryAddItems, metadata: UserMetadata & ReplicationMetadata) => S;
	inventoryRemoveItems: (state: S, payload: InventoryRemoveItems, metadata: UserMetadata & ReplicationMetadata) => S;
	inventoryEquipSlot: (state: S, payload: InventoryEquipSlot, metadata: UserMetadata & ReplicationMetadata) => S;
	inventoryUnequipSlot: (state: S, payload: InventoryUnequipSlot, metadata: UserMetadata & ReplicationMetadata) => S;
	inventoryPatchSlot: (state: S, payload: InventoryPatchSlot, metadata: UserMetadata & ReplicationMetadata) => S;
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
