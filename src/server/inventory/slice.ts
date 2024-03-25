import { InventoryImpl } from "shared/inventory/impl";
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
});