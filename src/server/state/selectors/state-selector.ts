import { createSelector } from "@rbxts/reflex";
import { selectInventoryState } from "./inventory-selector";
import { selectProfileState } from "./player-selector"; // Import the selectPlayerState function
import type { InventoryState, ProfileState } from "../slices"; // Import the PlayerState type
import type { ServerEntityState, ServerState } from "../producer";

export function selectState(user: string): (state: ServerState) => ServerEntityState {
	return createSelector(
		[selectInventoryState(user), selectProfileState(user)],
		(inventory: InventoryState, profile: ProfileState): ServerEntityState => {
			return {
				profile,
				inventory,
			};
		},
	);
}
