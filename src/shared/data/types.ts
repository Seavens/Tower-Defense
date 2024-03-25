import { type Item, isItemId } from "shared/item/types";
import { t } from "@rbxts/t";

export interface InventoryData {
	stored: Map<string, Item>;
	equipped: Map<string, Item>;
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
	stored: t.map(t.string, isItemId),
	equipped: t.map(t.string, isItemId),
});

export const isData: t.check<Data> = t.strictInterface({
	profile: isProfileData,
	inventory: isInventoryData,
});
