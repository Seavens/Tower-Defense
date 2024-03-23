import type { TowerObject } from "../objects";

export interface InventoryData {
	stored: Map<string, TowerObject>;
	equipped: Map<string, TowerObject>;
}
