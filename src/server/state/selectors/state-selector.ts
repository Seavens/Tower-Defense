import { createSelector } from "@rbxts/reflex";
import { selectInventoryState } from "./inventory-selector";
import type { InventoryState } from "../slices";
import type { ServerEntityState, ServerState } from "../producer";

export function selectState(user: string): (state: ServerState) => ServerEntityState {
	return createSelector([selectInventoryState(user)], (inventory: InventoryState): ServerEntityState => {
		return {
			inventory,
			player,
		};
	});
}
