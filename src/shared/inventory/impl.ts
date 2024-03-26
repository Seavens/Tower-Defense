import { MAXIMUM_EQUIPPED } from "./constants";
import { isDraft, original } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { InventoryData } from "shared/data/types";
import type { Item } from "./types";

export namespace InventoryImpl {
	export function getAvailableSlot(stored: Map<Slot, Item>, max: number): Slot | undefined {
		let available: Option<Slot>;
		for (const index of $range(1, max)) {
			const slot: Slot = `${index}`;
			if (stored.has(slot)) {
				continue;
			}
			available = slot;
			break;
		}
		return available;
	}

	export function equipTower(state: Draft<InventoryData>, slot: Slot): InventoryData {
		if (!isDraft(state)) {
			return state;
		}
		const { equipped, stored } = state;
		const tower = stored.get(slot);
		if (tower === undefined) {
			return original(state);
		}
		const available = getAvailableSlot(equipped, MAXIMUM_EQUIPPED);
		if (available === undefined) {
			return original(state);
		}
		equipped.set(available, tower);
		return state;
	}
}
