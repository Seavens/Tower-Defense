import { DATA_TEMPLATE } from "shared/players/data/constants";
import { InventoryImpl } from "shared/inventory/impl";
import { clear } from "@rbxts/immut/src/table";
import { createProducer } from "@rbxts/reflex";
import { original, produce } from "@rbxts/immut";
import type { DataAdded } from "shared/players/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ExcludeMetadata } from "shared/state/replication/metadata";
import type {
	InventoryActions,
	InventoryAddItems,
	InventoryEquipSlot,
	InventoryPatchSlot,
	InventoryRemoveItems,
	InventoryUnequipSlot,
} from "shared/inventory/actions";
import type { InventoryData } from "shared/players/data/types";

export interface InventoryState {
	readonly data: Readonly<InventoryData>;
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
	inventoryPatchSlot: (state: InventoryState, { slot, patch }: InventoryPatchSlot): InventoryState =>
		produce(state, (draft: Draft<InventoryState>): InventoryState => {
			const { data } = draft;
			const { stored } = data;
			const success = InventoryImpl.patchSlot(stored, slot, patch);
			if (!success) {
				return original(draft);
			}
			return draft;
		}),

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
	dataRemoved: (state: InventoryState): InventoryState => {
		return produce(state, (draft: Draft<InventoryState>): void => {
			clear(draft);
		});
	},
});
