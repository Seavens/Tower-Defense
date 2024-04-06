import { InventoryFilterKind } from "./types";
import { ItemRarity } from "shared/inventory/types";
import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";
import { usePx } from "../hooks";

export const SLOT_SIZE = new Vector2(60, 80);

export const INVENTORY_COLUMNS = 7;
export const INVENTORY_ROWS = 5;
export const INVENTORY_SLOTS_SIZE = new Vector2(SLOT_SIZE.X * INVENTORY_COLUMNS, SLOT_SIZE.Y * INVENTORY_ROWS);
export const INVENTORY_SIZE = new Vector2(INVENTORY_SLOTS_SIZE.X + 200, INVENTORY_SLOTS_SIZE.Y);
export const INVENTORY_TOPBAR_Y = 35;

export const HOTBAR_SIZE = new Vector2(SLOT_SIZE.X * MAXIMUM_EQUIPPED, SLOT_SIZE.Y);

export const RARITY_ORDERS: { [R in ItemRarity]: number } = {
	[ItemRarity.Rare]: 5,
	[ItemRarity.Epic]: 4,
	[ItemRarity.Legendary]: 3,
	[ItemRarity.Mythical]: 2,
	[ItemRarity.Secret]: 1,
} as const;

export const FILTER_DISPLAYS: { [F in InventoryFilterKind]: string } = {
	[InventoryFilterKind.All]: "All",
	[InventoryFilterKind.Level]: "Level",
	[InventoryFilterKind.Rarity]: "Rarity",
	[InventoryFilterKind.Locked]: "Locked",
	[InventoryFilterKind.Unlocked]: "Unlocked",
} as const;
