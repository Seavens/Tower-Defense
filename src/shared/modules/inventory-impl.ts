import { MAXIMUM_EQUIPPED } from "shared/constants/inventory-constants";
import { isDraft, original } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { InventoryData } from "shared/types/data";
import type { TowerObject } from "shared/types/objects";

export namespace InventoryImpl {
	export function getAvailableSlot(equipped: Map<string, TowerObject>): string | undefined {
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
			return original(state);
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
