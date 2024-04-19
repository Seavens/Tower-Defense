import { combineProducers } from "@rbxts/reflex";
import { inventorySlice } from "server/inventory/slice";
import { profileSlice } from "server/players/profile/slice";
import { settingSlice } from "../profile/settings/slice";
import type { InferState } from "@rbxts/reflex";
import type { InventoryState } from "server/inventory/slice";
import type { ProfileState } from "server/players/profile/slice";
import type { SettingState } from "../profile/settings/slice";

export type DataState = InferState<typeof dataSlice>;

export const dataSlice = combineProducers({
	inventory: inventorySlice,
	profile: profileSlice,
	setting: settingSlice,
});

export type { ProfileState, InventoryState, SettingState };
