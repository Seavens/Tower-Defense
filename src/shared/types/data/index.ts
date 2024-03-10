import { isItem } from "../objects";
import { t } from "@rbxts/t";
import type { InventoryData } from "./inventory-data";
import type { Item } from "../objects";
import type { ProfileData } from "./profile-data";

export interface Data {
	profile: ProfileData;
	inventory: InventoryData;
}

export const isProfileData: t.check<ProfileData> = t.strictInterface({
	level: t.number,
	experience: t.number,
	coins: t.number,
});

export const isInventoryData: t.check<InventoryData> = t.strictInterface({
	slots: t.map(t.string, isItem),
});

export const isData: t.check<Data> = t.strictInterface({
	profile: isProfileData,
	inventory: isInventoryData,
});

export const DATA_TEMPLATE: Data = {
	profile: {
		level: 1,
		experience: 0,
		coins: 0,
	},
	inventory: {
		slots: new Map<string, Item>(),
	},
};

export type { ProfileData, InventoryData };
