import { isItem } from "../objects";
import { t } from "@rbxts/t";
import type { InventoryData } from "./inventory-data";
import type { Item } from "../objects";

export interface Data {
	inventory: InventoryData;
}

export const isInventoryData: t.check<InventoryData> = t.strictInterface({
	slots: t.map(t.string, isItem),
});

export const isData: t.check<Data> = t.strictInterface({
	inventory: isInventoryData,
});

export const DATA_TEMPLATE: Data = {
	inventory: {
		slots: new Map<string, Item>(),
	},
};

export type { InventoryData };
