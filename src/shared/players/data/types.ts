import { type Item, isItem } from "shared/inventory/types";
import { isSlot } from "shared/utility/guards";
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
		musicEnabled: boolean;
		musicVolume: number;
		sfxEnabled: boolean;
		sfxVolume: number;
		vfxEnabled: boolean;
		mobBillboardsEnabled: boolean;
		towerBillboardsEnabled: boolean;
		keybinds: {
			slotOne: Enum.KeyCode;
			slotTwo: Enum.KeyCode;
			slotThree: Enum.KeyCode;
			slotFour: Enum.KeyCode;
			slotFive: Enum.KeyCode;
			slotSix: Enum.KeyCode;
		};
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
		musicEnabled: t.boolean,
		musicVolume: t.number,
		sfxEnabled: t.boolean,
		sfxVolume: t.number,
		vfxEnabled: t.boolean,
		mobBillboardsEnabled: t.boolean,
		towerBillboardsEnabled: t.boolean,

		keybinds: t.strictInterface({
			slotOne: t.enum(Enum.KeyCode),
			slotTwo: t.enum(Enum.KeyCode),
			slotThree: t.enum(Enum.KeyCode),
			slotFour: t.enum(Enum.KeyCode),
			slotFive: t.enum(Enum.KeyCode),
			slotSix: t.enum(Enum.KeyCode),
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
