import { DATA_TEMPLATE } from "shared/types/data";
import type { ClientState } from "../producer";
import type { InventoryData } from "shared/types/data";
import type { InventoryState } from "../slices";

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
