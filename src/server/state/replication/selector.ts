import { createSelector } from "@rbxts/reflex";
import { selectInventoryState } from "server/inventory/selectors"; // Import the PlayerState type
import { selectProfileState } from "server/players/profile/selectors";
import type { InventoryState, ProfileState } from "../slices";
import type { ServerEntityState, ServerState } from "../store";

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
