import { InventoryImpl } from "shared/inventory/impl";
import { createProducer } from "@rbxts/reflex";
import { isDraft, original, produce } from "@rbxts/immut";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata } from "shared/replication/metadata";
import type {
	InventoryActions,
	InventoryAddItems,
	InventoryEquipSlot,
	InventoryRemoveItems,
	InventoryUnequipSlot,
} from "shared/inventory/actions";
import type { InventoryData } from "shared/data/types";

export interface InventoryState {
	data: InventoryData;
}

interface State {
	[user: string]: InventoryState;
}

const state: State = {};

export const inventorySlice = createProducer<State, InventoryActions<State>>(state, {
	inventoryAddItems: (state: State, payload: InventoryAddItems, metadata: EntityMetadata): State => {
		const { items } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const { data } = state;
			const { stored } = data;
			const success = InventoryImpl.addItems(stored, items);
			if (!success) {
				return original(draft);
			}
			return draft;
		});
	},
	inventoryRemoveItems: (state: State, payload: InventoryRemoveItems, metadata: EntityMetadata): State => {
		const { slots } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const { data } = state;
			const { equipped, stored } = data;
			const success = InventoryImpl.removeItems(stored, equipped, slots);
			if (!success) {
				return original(draft);
			}
			return draft;
		});
	},
	inventoryEquipSlot: (state: State, payload: InventoryEquipSlot, metadata: EntityMetadata): State => {
		const { slot } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const { data } = state;
			const { equipped, stored } = data;
			const success = InventoryImpl.equipSlot(stored, equipped, slot);
			if (!success) {
				return original(draft);
			}
			return draft;
		});
	},
	inventoryUnequipSlot: (state: State, payload: InventoryUnequipSlot, metadata: EntityMetadata): State => {
		const { slot } = payload;
		const { user } = metadata;

		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const { data } = state;
			const { equipped } = data;
			const success = InventoryImpl.unequipSlot(equipped, slot);
			if (!success) {
				return original(draft);
			}
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
