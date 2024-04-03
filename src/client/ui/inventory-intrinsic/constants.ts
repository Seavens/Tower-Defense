import { MAXIMUM_STORED } from "shared/inventory/constants";

export const SLOT_SIZE = new Vector2(60, 80);

export const INVENTORY_COLUMNS = 7;
export const INVENTORY_ROWS = math.ceil(MAXIMUM_STORED / INVENTORY_COLUMNS);
export const INVENTORY_SLOTS_SIZE = new Vector2(SLOT_SIZE.X * INVENTORY_COLUMNS, SLOT_SIZE.Y * INVENTORY_COLUMNS);
export const INVENTORY_SIZE = new Vector2(INVENTORY_SLOTS_SIZE.X + 300, INVENTORY_SLOTS_SIZE.Y);
