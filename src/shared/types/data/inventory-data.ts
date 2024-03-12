import type { Tower } from "../objects";

export interface InventoryData {
	stored: Map<string, Tower>;
	equipped: Map<string, Tower>;
}
