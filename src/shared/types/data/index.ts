import { isItem } from "../objects";
import { t } from "@rbxts/t";
import type { InventoryData } from "./inventory-data";
import type { Item } from "../objects";
import type { PlayerData } from "./player-data";

export interface Data {
	player: PlayerData;
	inventory: InventoryData;
}

export const isPlayerData: t.check<PlayerData> = t.strictInterface({
	level: t.number,
	experience: t.number,
	gold: t.number,
	inventory: t.array(isItem),
});

export const isInventoryData: t.check<InventoryData> = t.strictInterface({
	slots: t.map(t.string, isItem),
});

export const isData: t.check<Data> = t.strictInterface({
	player: isPlayerData,
	inventory: isInventoryData,
});

export const DATA_TEMPLATE: Data = {
	player: {
		level: 1,
		experience: 0,
		gold: 0,
	},
	inventory: {
		slots: new Map<string, Item>(),
	},
};

export type { PlayerData, InventoryData };
