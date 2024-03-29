import { MAXIMUM_EQUIPPED } from "./constants";
import { isDraft, original } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { InventoryData } from "shared/data/types";
import type { Item } from "./types";

export namespace InventoryImpl {
	export function getAvailableSlot(storage: Map<Slot, Item>, max: number): Slot | undefined {
		let available: Option<Slot>;
		for (const index of $range(1, max)) {
			const slot: Slot = `${index}`;
			if (storage.has(slot)) {
				continue;
			}
			available = slot;
			break;
		}
		return available;
	}
}
