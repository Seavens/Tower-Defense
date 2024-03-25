import { createSelector } from "@rbxts/reflex";
import { selectInventoryData } from "server/inventory/selectors";
import { selectProfileData } from "server/profile/selectors";
import type { Data, InventoryData, ProfileData } from "shared/data/types";
import type { ServerState } from "../state/store";

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
