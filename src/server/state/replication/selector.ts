import { createSelector } from "@rbxts/reflex";
import { selectInventoryState } from "server/inventory/selectors";
import { selectProfileState } from "server/players/profile/selectors";
import { selectSettingByUser } from "server/players/profile/settings/selectors";
import type { InventoryState } from "server/inventory/slice"; // Import the PlayerState type
import type { ProfileState } from "server/players/profile/slice";
import type { ServerEntityState, ServerState } from "../store";
import type { SettingPlayerState } from "server/players/profile/settings";

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
