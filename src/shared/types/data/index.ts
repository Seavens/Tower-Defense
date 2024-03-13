import { isTower } from "../objects";
import { t } from "@rbxts/t";
import type { InventoryData } from "./inventory-data";
import type { ProfileData } from "./profile-data";
import type { Tower } from "../objects";

export interface Data {
	profile: ProfileData;
	inventory: InventoryData;
}

export const isProfileData: t.check<ProfileData> = t.strictInterface({
	level: t.number,
	experience: t.number,
	coins: t.number,
	gems: t.number,
	dailyRewards: t.strictInterface({
		lastClaimed: t.DateTime,
		streak: t.number,
	}),
});

export const isInventoryData: t.check<InventoryData> = t.strictInterface({
	stored: t.map(t.string, isTower),
	equipped: t.map(t.string, isTower),
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
		gems: 0,
		dailyRewards: {
			lastClaimed: DateTime.now(),
			streak: 0,
		},
	},
	inventory: {
		stored: new Map<string, Tower>(),
		equipped: new Map<string, Tower>(),
	},
};

export type { ProfileData, InventoryData };
