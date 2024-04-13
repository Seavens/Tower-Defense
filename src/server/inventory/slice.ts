import { InventoryImpl } from "shared/inventory/impl";
import { createProducer } from "@rbxts/reflex";
import { original, produce } from "@rbxts/immut";
import type { DataAdded } from "shared/data/actions";
import type { Draft } from "@rbxts/immut/src/types-external";
import type {
	InventoryActions,
	InventoryAddItems,
	InventoryEquipSlot,
	InventoryPatchSlot,
	InventoryRemoveItems,
	InventoryUnequipSlot,
} from "shared/inventory/actions";
import type { InventoryData } from "shared/data/types";
import type { UserMetadata } from "shared/replication/metadata";

export interface InventoryState {
	readonly data: Readonly<InventoryData>;
}

interface State {
	readonly [user: string]: InventoryState;
}

const state: State = {};

export const inventorySlice = createProducer<State, InventoryActions<State>>(state, {
	inventoryAddItems: (state: State, payload: InventoryAddItems, metadata: UserMetadata): State => {
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
	inventoryRemoveItems: (state: State, payload: InventoryRemoveItems, metadata: UserMetadata): State => {
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
	inventoryEquipSlot: (state: State, payload: InventoryEquipSlot, metadata: UserMetadata): State => {
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
	inventoryUnequipSlot: (state: State, payload: InventoryUnequipSlot, metadata: UserMetadata): State => {
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
	inventoryPatchSlot: (state: State, { slot, patch }: InventoryPatchSlot, { user }: UserMetadata): State =>
		produce(state, (draft: Draft<State>): State => {
			const state = draft[user];
			if (state === undefined) {
				return original(draft);
			}
			const { data } = state;
			const { stored } = data;
			const success = InventoryImpl.patchSlot(stored, slot, patch);
			if (!success) {
				return original(draft);
			}
			return draft;
		}),

	dataAdded: (state: State, payload: DataAdded, metadata: UserMetadata): State => {
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
});
