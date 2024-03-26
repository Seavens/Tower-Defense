import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";

export const ITEM_SLOT_SIZE = new Vector2(60, 75);

export const EXP_BAR_SIZE_Y = 20;

export const HOTBAR_PADDING = 5;
export const HOTBAR_SIZE = new Vector2(
	ITEM_SLOT_SIZE.X * MAXIMUM_EQUIPPED + HOTBAR_PADDING * (MAXIMUM_EQUIPPED - 1),
	ITEM_SLOT_SIZE.Y + EXP_BAR_SIZE_Y + HOTBAR_PADDING * 2,
);

export const INVENTORY_SIZE = new Vector2(ITEM_SLOT_SIZE.X * 12, ITEM_SLOT_SIZE.Y * 6);

export const INVENTORY_ROW_SIZE = 7;
export const SCROLLING_DEPTH = 45.5 * ITEM_SLOT_SIZE.Y;
