import { DATA_TEMPLATE } from "shared/types/data";
import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type {
	DataAdded,
	DataRemoved,
	InventoryActions,
	InventoryAddItem,
	InventoryRemoveItem,
} from "shared/state/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { InventoryData } from "shared/types/data";

export interface InventoryState {
	data: InventoryData;
}

const state: InventoryState = {
	data: DATA_TEMPLATE.inventory,
};

export const inventorySlice = createProducer<InventoryState, InventoryActions<InventoryState>>(state, {
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
			const { slots } = data;
			slots.set(slot, item);
			return draft;
		});
	},
	inventoryRemoveItem: (state: InventoryState, payload: InventoryRemoveItem): InventoryState => {
		const { slot } = payload;
		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { slots } = data;
			slots.delete(slot);
			return draft;
		});
	},
});
