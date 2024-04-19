import { type Item, isItem } from "shared/inventory/types";
import { isSettings } from "../settings";
import { isSlot } from "shared/utility/guards";
import { t } from "@rbxts/t";
import type { Settings } from "../settings";

export interface ProfileData {
	level: number;
	experience: number;
	coins: number;
	gems: number;
}

export interface InventoryData {
	stored: Map<Slot, Item>;
	equipped: Array<Slot>;
}

export interface Data {
	profile: ProfileData;
	inventory: InventoryData;
	settings: Settings;
}

export const isProfileData: t.check<ProfileData> = t.strictInterface({
	level: t.number,
	experience: t.number,
	coins: t.number,
	gems: t.number,
});

export const isInventoryData: t.check<InventoryData> = t.strictInterface({
	stored: t.map(isSlot, isItem),
	equipped: t.array(isSlot),
});

export const isData: t.check<Data> = t.strictInterface({
	profile: isProfileData,
	inventory: isInventoryData,
	settings: isSettings,
});
