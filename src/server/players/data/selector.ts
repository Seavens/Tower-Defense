import { createSelector } from "@rbxts/reflex";
import { selectInventoryData } from "server/inventory/selectors";
import { selectProfileData } from "server/players/profile/selectors";
import { selectSettingByUser } from "../profile/settings";
import type { Data, InventoryData, ProfileData } from "shared/players/data/types";
import type { ServerState } from "../../state/store";
import type { SettingPlayerState } from "../profile/settings";

export function selectData(user: string): (state: ServerState) => Data {
	return createSelector(
		[selectInventoryData(user), selectProfileData(user), selectSettingByUser(user)],
		(inventory: InventoryData, profile: ProfileData, { data: settings }: SettingPlayerState): Data => {
			return {
				profile,
				inventory,
				settings,
			};
		},
	);
}
