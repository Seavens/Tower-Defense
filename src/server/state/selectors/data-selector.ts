import { createSelector } from "@rbxts/reflex";
import { selectInventoryData } from "./inventory-selector";
import type { Data, InventoryData } from "shared/types/data";
import type { ServerState } from "../producer";

export function selectData(user: string): (state: ServerState) => Data {
	return createSelector([selectInventoryData(user)], (inventory: InventoryData): Data => {
		return {
			inventory,
		};
	});
}
