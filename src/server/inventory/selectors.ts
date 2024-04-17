import { DATA_TEMPLATE } from "shared/players/data/constants";
import type { InventoryData } from "shared/players/data/types";
import type { InventoryState } from "./slice";
import type { ServerState } from "server/state/store";

export function selectInventoryState(user: string): (state: ServerState) => InventoryState {
	return function (state: ServerState): InventoryState {
		const { data } = state;
		const { inventory } = data;
		let result = inventory[user];
		if (result === undefined) {
			result = { data: DATA_TEMPLATE.inventory };
		}
		return result;
	};
}

export function selectInventoryData(user: string): (state: ServerState) => InventoryData {
	return function (state: ServerState): InventoryData {
		const inventory = selectInventoryState(user)(state);
		return inventory.data;
	};
}
