import type { Data } from "./types";
import type { Item } from "shared/inventory/types";

export const DATA_TEMPLATE: Data = {
	profile: {
		level: 1,
		experience: 0,
		coins: 0,
		gems: 0,
		settings: {
			musicEnabled: true,
			musicVolume: math.clamp(100, 0, 100),
			sfxEnabled: true,
			sfxVolume: math.clamp(100, 0, 100),
			vfxEnabled: true,
			mobBillboardsEnabled: true,
			towerBillboardsEnabled: true,

			keybinds: {
				slotOne: Enum.KeyCode.One,
				slotTwo: Enum.KeyCode.Two,
				slotThree: Enum.KeyCode.Three,
				slotFour: Enum.KeyCode.Four,
				slotFive: Enum.KeyCode.Five,
				slotSix: Enum.KeyCode.Six,
			},
		},
	},
	inventory: {
		stored: new Map<Slot, Item>(),
		equipped: new Array<Slot>(),
	},
};
