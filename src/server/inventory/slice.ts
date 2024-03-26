import { InventoryImpl } from "shared/inventory/impl";
import { MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { createProducer } from "@rbxts/reflex";
import { original, produce } from "@rbxts/immut";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata } from "shared/replication/metadata";
import type {
	InventoryActions,
	InventoryAddItem,
	InventoryAddItems,
	InventoryRemoveItem,
	InventoryRemoveItems,
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
	dataAdded: (state: State, payload: DataAdded, metadata: EntityMetadata): State => {
		const { data } = payload;
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			const { inventory } = data;
			const state: InventoryState = {
				data: inventory,
			};
			draft[user] = state;
		});
	},
	dataRemoved: (state: State, payload: DataRemoved, metadata: EntityMetadata): State => {
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): void => {
			delete draft[user];
		});
	},
	inventoryAddItem: (state: State, payload: InventoryAddItem, metadata: EntityMetadata): State => {
		const { item, slot } = payload;
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const { data } = state;
			const { stored } = data;
			stored.set(slot, item);
			return draft;
		});
	},
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
			for (const item of items) {
				const available = InventoryImpl.getAvailableSlot(stored, MAXIMUM_STORED);
				if (available === undefined) {
					return original(draft);
				}
				stored.set(available, item);
			}
			return draft;
		});
	},
	inventoryRemoveItem: (state: State, payload: InventoryRemoveItem, metadata: EntityMetadata): State => {
		const { slot } = payload;
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const { data } = state;
			const { stored } = data;
			stored.delete(slot);
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
			const { stored } = data;
			for (const slot of slots) {
				stored.delete(slot);
			}
			return draft;
		});
	},
	inventoryEquipItem: (state: State, payload: InventoryRemoveItem, metadata: EntityMetadata): State => {
		const { slot } = payload;
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const data = InventoryImpl.equipTower(state.data, slot);
			state.data = data;
			return draft;
		});
	},
	inventoryEquipItems: (state: State, payload: InventoryAddItems, metadata: EntityMetadata): State => {
		const { items } = payload;
		const { user } = metadata;
		return produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const { data } = state;
			const { equipped } = data;
			for (const item of items) {
				const available = InventoryImpl.getAvailableSlot(equipped, MAXIMUM_EQUIPPED);
				if (available === undefined) {
					return original(draft);
				}
				equipped.set(available, item);
			}
			return draft;
		});
	},
});
