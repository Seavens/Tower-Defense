import { DATA_TEMPLATE } from "shared/data/constants";
import { InventoryImpl } from "shared/inventory/impl";
import { MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { original, produce } from "@rbxts/immut";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ExcludeMetadata } from "shared/replication/metadata";
import type {
	InventoryActions,
	InventoryAddItem,
	InventoryEquipItem,
	InventoryRemoveItem,
} from "shared/inventory/actions";
import type { InventoryData } from "shared/data/types";

export interface InventoryState {
	data: InventoryData;
}

const state: InventoryState = {
	data: DATA_TEMPLATE.inventory,
};

export const inventorySlice = createProducer<InventoryState, ExcludeMetadata<InventoryActions<InventoryState>>>(state, {
	inventoryAddItem: (state: InventoryState, payload: InventoryAddItem): InventoryState => {
		const { items } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { stored } = state.data;

			// If the state is undefined or the inventory is full, return the original state
			if (state === undefined || stored.size() + items.size() > MAXIMUM_STORED) {
				return original(draft);
			}

			// Add the items to the inventory
			for (const item of items) {
				// Get the first available slot
				const available = InventoryImpl.getAvailableSlot(stored, MAXIMUM_STORED);

				// If there are no available slots, return the original state
				if (available === undefined) {
					return original(draft);
				}

				// Add the item to the inventory
				stored.set(available, item);
			}

			// Return the updated state
			return draft;
		});
	},
	inventoryRemoveItem: (state: InventoryState, payload: InventoryRemoveItem): InventoryState => {
		const { slots } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { stored } = state.data;

			// If the state is undefined or the inventory is empty, return the original state;
			if (state === undefined || stored.size() === 0) {
				return original(draft);
			}

			// Remove the items from the inventory
			for (const slot of slots) {
				stored.delete(slot);
			}

			// Return the updated state
			return draft;
		});
	},
	inventoryEquipItem: (state: InventoryState, payload: InventoryEquipItem): InventoryState => {
		const { items } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { equipped } = state.data;

			// If the state is undefined or the EQUIPPED inventory is full, return the original state
			if (state === undefined || state.data.equipped.size() + items.size() > MAXIMUM_EQUIPPED) {
				return original(draft);
			}

			// Equip the items
			for (const item of items) {
				// Get the first available slot
				const available = InventoryImpl.getAvailableSlot(equipped, MAXIMUM_EQUIPPED);

				// If there are no available slots, return the original state
				if (available === undefined) {
					return original(draft);
				}

				// Equip the item
				equipped.set(available, item);
			}

			// Return the updated state
			return draft;
		});
	},
	inventoryUnequipItem: (state: InventoryState, payload: InventoryRemoveItem): InventoryState => {
		const { slots } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { equipped } = state.data;

			// If the state is undefined or the EQUIPPED inventory is empty, return the original state
			if (state === undefined || equipped.size() === 0) {
				return original(draft);
			}

			// Unequip the items
			for (const slot of slots) {
				// If the item is not in the inventory, return the original state
				if (!equipped.has(slot)) {
					return original(draft);
				}

				// Unequip the item
				const item = equipped.get(slot)!;
				equipped.delete(slot);

				// Get the first available slot
				const available = InventoryImpl.getAvailableSlot(state.data.stored, MAXIMUM_STORED);

				// If there are no available slots, return the original state
				if (available === undefined) {
					return original(draft);
				}

				// Add the item to the inventory
				state.data.stored.set(available, item);
			}

			// Return the updated state
			return draft;
		});
	},

	// Data actions
	dataAdded: (state: InventoryState, payload: DataAdded): InventoryState => {
		const { data } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { inventory } = data;

			// Return the updated state
			const state: InventoryState = {
				data: inventory,
			};
			return state;
		});
	},
	dataRemoved: (state: InventoryState, payload: DataRemoved): InventoryState => {
		return produce(state, (draft: Draft<InventoryState>): void => {
			clear(draft);
		});
	},
});
