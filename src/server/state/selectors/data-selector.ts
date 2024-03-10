import { createSelector } from "@rbxts/reflex";
import { selectInventoryData } from "./inventory-selector";
import { selectPlayerData } from "./player-selector";
import type { Data, InventoryData, ProfileData } from "shared/types/data";
import type { ServerState } from "../producer";

export function selectData(user: string): (state: ServerState) => Data {
	return createSelector(
		[selectInventoryData(user), selectPlayerData(user)],
		(inventory: InventoryData, profile: ProfileData): Data => {
			return {
				profile,
				inventory,
			};
		},
	);
}
