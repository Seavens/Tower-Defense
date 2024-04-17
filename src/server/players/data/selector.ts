import { createSelector } from "@rbxts/reflex";
import { selectInventoryData } from "server/inventory/selectors";
import { selectProfileData } from "server/players/profile/selectors";
import type { Data, InventoryData, ProfileData } from "shared/players/data/types";
import type { ServerState } from "../../state/store";

export function selectData(user: string): (state: ServerState) => Data {
	return createSelector(
		[selectInventoryData(user), selectProfileData(user)],
		(inventory: InventoryData, profile: ProfileData): Data => {
			return {
				profile,
				inventory,
			};
		},
	);
}
