import { isTowerObject } from "shared/tower/types";
import { t } from "@rbxts/t";
import type { TowerObject } from "shared/tower/types";

export interface InventoryData {
	stored: Map<string, TowerObject>;
	equipped: Map<string, TowerObject>;
}

export interface ProfileData {
	level: number;
	experience: number;
	coins: number;
	gems: number;

	// dailyRewards: {
	// 	lastClaimed: string;
	// 	streak: number;
	// };
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
	stored: t.map(t.string, isTowerObject),
	equipped: t.map(t.string, isTowerObject),
});

export const isData: t.check<Data> = t.strictInterface({
	profile: isProfileData,
	inventory: isInventoryData,
});
