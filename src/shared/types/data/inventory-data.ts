import type { Tower } from "../objects";

export interface InventoryData {
	slots: Map<string, Tower>;
}
