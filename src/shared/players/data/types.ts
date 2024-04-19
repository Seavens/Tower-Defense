import { type Item, isItem } from "shared/inventory/types";
import { isSlot } from "shared/utility/guards";
import { t } from "@rbxts/t";

export interface InventoryData {
	stored: Map<Slot, Item>;
	equipped: Array<Slot>;
}

interface Settings {
	visual: {
		vfx: boolean;
		shake: boolean;
		mobBB: boolean;
		towerBB: boolean;
	};
	audio: {
		music: boolean;
		musicVol: number;
		sfx: boolean;
		sfxVol: number;
	};
	keybinds: {
		slotOne: string;
		slotTwo: string;
		slotThree: string;
		slotFour: string;
		slotFive: string;
		slotSix: string;
	};
}

export interface ProfileData {
	level: number;
	experience: number;
	coins: number;
	gems: number;
	settings: Settings;
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
		visual: t.strictInterface({
			vfx: t.boolean,
			shake: t.boolean,
			mobBB: t.boolean,
			towerBB: t.boolean,
		}),
		audio: t.strictInterface({
			music: t.boolean,
			musicVol: t.number,
			sfx: t.boolean,
			sfxVol: t.number,
		}),
		keybinds: t.strictInterface({
			slotOne: t.string,
			slotTwo: t.string,
			slotThree: t.string,
			slotFour: t.string,
			slotFive: t.string,
			slotSix: t.string,
		}),
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
