import { createSelector } from "@rbxts/reflex";
import { selectInventoryData } from "./inventory-selector";
import type { Data, InventoryData } from "shared/types/data";

export const selectData = createSelector([selectInventoryData], (inventory: InventoryData): Data => {
	return {
		inventory,
	};
});
