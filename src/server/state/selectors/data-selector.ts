import { createSelector } from "@rbxts/reflex";
import { selectInventoryData } from "./inventory-selector";
import type { Data, InventoryData, PlayerData } from "shared/types/data";
import type { ServerState } from "../producer";

export function selectData(user: string): (state: ServerState) => Data {
	return createSelector(
		[selectInventoryData(user), selectPlayerData(user)],
		(inventory: InventoryData, playerData: PlayerData): Data => {
			return {
				inventory,
				player,
			};
		},
	);
}
