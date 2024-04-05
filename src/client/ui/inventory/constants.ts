import { ItemRarity } from "shared/inventory/types";
import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";

export const SLOT_SIZE = new Vector2(60, 80);

export const INVENTORY_COLUMNS = 7;
export const INVENTORY_ROWS = 5;
export const INVENTORY_SLOTS_SIZE = new Vector2(SLOT_SIZE.X * INVENTORY_COLUMNS, SLOT_SIZE.Y * INVENTORY_ROWS);
export const INVENTORY_SIZE = new Vector2(INVENTORY_SLOTS_SIZE.X + 200, INVENTORY_SLOTS_SIZE.Y);
export const INVENTORY_TOPBAR_Y = 35;

export const EXP_BAR_SIZE_Y = 200;
export const HOTBAR_SIZE = new Vector2(SLOT_SIZE.X * MAXIMUM_EQUIPPED, SLOT_SIZE.Y + EXP_BAR_SIZE_Y);

export const RARITY_ORDERS: { [R in ItemRarity]: number } = {
	[ItemRarity.Rare]: 5,
	[ItemRarity.Epic]: 4,
	[ItemRarity.Legendary]: 3,
	[ItemRarity.Mythical]: 2,
	[ItemRarity.Secret]: 1,
};
