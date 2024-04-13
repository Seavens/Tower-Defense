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
	settings: {
		music: boolean;
		sfx: boolean;
		audioLevel: number;
		vfx: boolean;
		billboards: boolean;
	};
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
	settings: t.strictInterface({
		music: t.boolean,
		sfx: t.boolean,
		audioLevel: t.number,
		vfx: t.boolean,
		billboards: t.boolean,
	}),
});

export const isInventoryData: t.check<InventoryData> = t.strictInterface({
	stored: t.map(isSlot, isItem),
	equipped: t.array(isSlot),
});

export const isData: t.check<Data> = t.strictInterface({
	profile: isProfileData,
	inventory: isInventoryData,
});
