import { DATA_TEMPLATE } from "shared/data/constants";
import { InventoryImpl } from "shared/inventory/impl";
import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { isDraft, original, produce } from "@rbxts/immut";
import type { DataAdded, DataRemoved } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ExcludeMetadata } from "shared/replication/metadata";
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

const state: InventoryState = {
	data: DATA_TEMPLATE.inventory,
};

export const inventorySlice = createProducer<InventoryState, ExcludeMetadata<InventoryActions<InventoryState>>>(state, {
	inventoryAddItems: (state: InventoryState, payload: InventoryAddItems): InventoryState => {
		const { items } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { stored } = data;
			const success = InventoryImpl.addItems(stored, items);
			if (!success) {
				return original(draft);
			}
			return draft;
		});
	},
	inventoryRemoveItems: (state: InventoryState, payload: InventoryRemoveItems): InventoryState => {
		const { slots } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { equipped, stored } = data;
			const success = InventoryImpl.removeItems(stored, equipped, slots);
			if (!success) {
				return original(draft);
			}
			return draft;
		});
	},
	inventoryEquipSlot: (state: InventoryState, payload: InventoryEquipSlot): InventoryState => {
		const { slot } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { equipped, stored } = data;
			const success = InventoryImpl.equipSlot(stored, equipped, slot);
			if (!success) {
				return original(draft);
			}
			return draft;
		});
	},
	inventoryUnequipSlot: (state: InventoryState, payload: InventoryUnequipSlot): InventoryState => {
		const { slot } = payload;

		return produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { equipped } = data;
			const success = InventoryImpl.unequipSlot(equipped, slot);
			if (!success) {
				return original(draft);
			}
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
