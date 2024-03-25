import { MAXIMUM_EQUIPPED } from "./constants";
import { isDraft, original } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { InventoryData } from "shared/data/types";
import type { Item } from "shared/item/types";

export namespace InventoryImpl {
	export function getAvailableSlot(equipped: Map<string, Item>): string | undefined {
		let available: string | undefined;
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot = `${index}`;
			if (equipped.has(slot)) {
				continue;
			}
			available = slot;
		}
		return available;
	}

	export function equipTower(state: Draft<InventoryData>, slot: string): InventoryData {
		if (!isDraft(state)) {
			return state;
		}
		const { equipped, stored } = state;
		const tower = stored.get(slot);
		if (tower === undefined) {
			return original(state);
		}
		const available = getAvailableSlot(equipped);
		if (available === undefined) {
			return original(state);
		}
		equipped.set(available, tower);
		return state;
	}
}
