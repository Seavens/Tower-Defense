import { MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";

export const ITEM_SLOT_SIZE = new Vector2(60, 75);

export const EXP_BAR_SIZE_Y = 20;

export const HOTBAR_PADDING = 5;
export const HOTBAR_SIZE = new Vector2(
	ITEM_SLOT_SIZE.X * MAXIMUM_EQUIPPED + HOTBAR_PADDING * (MAXIMUM_EQUIPPED - 1),
	ITEM_SLOT_SIZE.Y + EXP_BAR_SIZE_Y + HOTBAR_PADDING * 2,
);

export const INVENTORY_SIZE = new Vector2(ITEM_SLOT_SIZE.X * 12, ITEM_SLOT_SIZE.Y * 6);

export const INVENTORY_ROW_SIZE = 7;
export const INVENTORY_COLUMN_COUNT = MAXIMUM_STORED / INVENTORY_ROW_SIZE;

export const TRANSPARENCY_GRADIENT = new NumberSequence(0, 1);
