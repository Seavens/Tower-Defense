import { type SettingPlayerState, selectSettingByUser } from "server/players/profile/settings";
import { createSelector } from "@rbxts/reflex"; // Import the PlayerState type
import { selectInventoryState } from "server/inventory/selectors";
import { selectProfileState } from "server/players/profile/selectors";
import type { InventoryState } from "server/inventory/slice";
import type { ProfileState } from "server/players/profile/slice";
import type { ServerEntityState, ServerState } from "../store";

export function selectState(user: string): (state: ServerState) => ServerEntityState {
	return createSelector(
		[selectInventoryState(user), selectProfileState(user), selectSettingByUser(user)],
		(inventory: InventoryState, profile: ProfileState, setting: SettingPlayerState): ServerEntityState => {
			return {
				profile,
				inventory,
				setting,
			};
		},
	);
}
