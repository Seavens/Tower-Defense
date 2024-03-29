import { InventoryImpl } from "shared/inventory/impl";
import { MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { createProducer } from "@rbxts/reflex";
import { original, produce } from "@rbxts/immut";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata } from "shared/replication/metadata";
import type { InventoryActions, InventoryAddItem, InventoryRemoveItem } from "shared/inventory/actions";
import type { InventoryData } from "shared/data/types";

export interface InventoryState {
	data: InventoryData;
}

interface State {
	[user: string]: InventoryState;
}

const state: State = {};

export const inventorySlice = createProducer<State, InventoryActions<State>>(state, {
	inventoryAddItem: (state: State, payload: InventoryAddItem, metadata: EntityMetadata): State => {
		const { items } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			const { stored } = state.data;

			// If the state is undefined or the inventory is full, return the original state
			if (state === undefined || stored.size() + items.size() > MAXIMUM_STORED) {
				return original(draft);
			}

			// Add the items to the inventory
			for (const item of items) {
				//	Get the first available slot
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
	inventoryRemoveItem: (state: State, payload: InventoryRemoveItem, metadata: EntityMetadata): State => {
		const { slots } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
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
	inventoryEquipItem: (state: State, payload: InventoryAddItem, metadata: EntityMetadata): State => {
		const { items } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
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
	inventoryUnequipItem: (state: State, payload: InventoryRemoveItem, metadata: EntityMetadata): State => {
		const { slots } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			const { equipped, stored } = state.data;

			// If the state is undefined or the inventory is empty, return the original state
			if (state === undefined || stored.size() >= MAXIMUM_STORED) {
				return original(draft);
			}

			// Unequip the items
			for (const slot of slots) {
				// If the item is not in the inventory, return the original state
				if (!equipped.has(slot)) {
					return original(draft);
				}

				// Unequip the item
				stored.set(slot, equipped.get(slot)!);

				// Remove the item from the EQUIPPED inventory
				equipped.delete(slot);
			}

			// Return the updated state
			return draft;
		});
	},

	// Data actions
	dataAdded: (state: State, payload: DataAdded, metadata: EntityMetadata): State => {
		const { data } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): void => {
			const { inventory } = data;

			// Add the inventory state to the draft
			const state: InventoryState = {
				data: inventory,
			};

			// Add the inventory state to the draft
			draft[user] = state;
		});
	},
	dataRemoved: (state: State, payload: DataRemoved, metadata: EntityMetadata): State => {
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): void => {
			delete draft[user];
		});
	},
});
