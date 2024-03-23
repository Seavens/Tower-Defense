import { createSelector } from "@rbxts/reflex";
import { selectInventoryData } from "./inventory-selector";
import { selectProfileData } from "./profile-selector";
import type { Data, InventoryData, ProfileData } from "shared/types/data";

export const selectData = createSelector(
	[selectInventoryData, selectProfileData],
	(inventory: InventoryData, profile: ProfileData): Data => {
		return {
			profile,
			inventory,
		};
	},
);
