import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";

export const ITEM_SLOT_SIZE = new Vector2(60, 75);

export const EXP_BAR_SIZE_Y = 20;

export const HOTBAR_PADDING = 5;
export const HOTBAR_SIZE = new Vector2(
	ITEM_SLOT_SIZE.X * MAXIMUM_EQUIPPED + HOTBAR_PADDING * (MAXIMUM_EQUIPPED - 1),
	ITEM_SLOT_SIZE.Y + EXP_BAR_SIZE_Y + HOTBAR_PADDING * 2,
);
