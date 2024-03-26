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
	InventoryAddItems,
	InventoryEquipItems,
	InventoryRemoveItem,
	InventoryRemoveItems,
} from "shared/inventory/actions";
import type { InventoryData } from "shared/data/types";

export interface InventoryState {
	data: InventoryData;
}

const state: InventoryState = {
	data: DATA_TEMPLATE.inventory,
};

export const inventorySlice = createProducer<InventoryState, ExcludeMetadata<InventoryActions<InventoryState>>>(state, {
	dataAdded: (state: InventoryState, payload: DataAdded): InventoryState => {
		const { data } = payload;
		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { inventory } = data;
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
	inventoryAddItem: (state: InventoryState, payload: InventoryAddItem): InventoryState => {
		const { item, slot } = payload;
		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { stored } = data;
			stored.set(slot, item);
			return draft;
		});
	},
	inventoryAddItems: (state: InventoryState, payload: InventoryAddItems): InventoryState => {
		const { items } = payload;
		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { stored } = data;
			for (const i of $range(1, items.size())) {
				const available = InventoryImpl.getAvailableSlot(stored, MAXIMUM_STORED);
				if (available === undefined) {
					return original(draft);
				}
				const item = items[i];
				stored.set(available, item);
			}
			return draft;
		});
	},
	inventoryRemoveItem: (state: InventoryState, payload: InventoryRemoveItem): InventoryState => {
		const { slot } = payload;
		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { stored } = data;
			stored.delete(slot);
			return draft;
		});
	},
	inventoryRemoveItems: (state: InventoryState, payload: InventoryRemoveItems): InventoryState => {
		const { slots } = payload;
		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { stored } = data;
			for (const slot of slots) {
				stored.delete(slot);
			}
			return draft;
		});
	},
	inventoryEquipItem: (state: InventoryState, payload: InventoryRemoveItem): InventoryState => {
		const { slot } = payload;
		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const data = InventoryImpl.equipTower(state.data, slot);
			state.data = data;
			return draft;
		});
	},
	inventoryEquipItems: (state: InventoryState, payload: InventoryEquipItems): InventoryState => {
		const { items } = payload;
		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
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
