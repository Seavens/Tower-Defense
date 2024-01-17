import type { Item } from "../objects";

export interface InventoryData {
	slots: Map<string, Item>;
}
