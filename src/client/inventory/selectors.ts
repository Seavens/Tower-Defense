import { DATA_TEMPLATE } from "shared/data/constants";
import type { ClientState } from "client/state/store";
import type { InventoryData } from "shared/data/types";
import type { InventoryState } from "./slice";

export function selectInventoryState(state: ClientState): InventoryState {
	const { inventory } = state;
	let result = inventory;
	if (result === undefined) {
		result = { data: DATA_TEMPLATE.inventory };
	}
	return result;
}

export function selectInventoryData(state: ClientState): InventoryData {
	const inventory = selectInventoryState(state);
	return inventory.data;
}
