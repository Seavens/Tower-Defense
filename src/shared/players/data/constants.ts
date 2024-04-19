import type { Data } from "./types";
import type { Item } from "shared/inventory/types";

export const DATA_TEMPLATE: Data = {
	profile: {
		level: 1,
		experience: 0,
		coins: 0,
		gems: 0,
		settings: {
			visual: {
				vfx: true,
				shake: true,
				mobBB: true,
				towerBB: true,
			},
			audio: {
				music: true,
				musicVol: 100,
				sfx: true,
				sfxVol: 100,
			},
			keybinds: {
				slotOne: "One",
				slotTwo: "Two",
				slotThree: "Three",
				slotFour: "Four",
				slotFive: "Five",
				slotSix: "Six",
			},
		},
	},
	inventory: {
		stored: new Map<Slot, Item>(),
		equipped: new Array<Slot>(),
	},
};
