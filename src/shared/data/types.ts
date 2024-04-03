import { type Item, isItem } from "shared/inventory/types";
import { isSlot } from "shared/guards";
import { t } from "@rbxts/t";

export interface InventoryData {
	stored: Map<Slot, Item>;
	equipped: Array<Slot>;
}

export interface ProfileData {
	level: number;
	experience: number;
	coins: number;
	gems: number;
}

export interface Data {
	profile: ProfileData;
	inventory: InventoryData;
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
});
