import { Dictionary } from "@rbxts/sift";
import { MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "./constants";
import { isDraft } from "@rbxts/immut";
import type { Item } from "./types";

export namespace InventoryImpl {
	export function getAvailableSlot(inventory: Map<Slot, Item>, max: number): Slot | undefined {
		let available: Option<Slot>;
		for (const index of $range(1, max)) {
			const slot: Slot = `${index}`;
			if (inventory.has(slot)) {
				continue;
			}
			available = slot;
			break;
		}
		return available;
	}

	export function addItems(storage: Map<Slot, Item>, adding: Array<Item>): boolean {
		if (!isDraft(storage)) {
			return false;
		}
		let size = storage.size();
		if (size > MAXIMUM_STORED) {
			return false;
		}
		adding = Dictionary.copyDeep(adding);
		for (const item of adding) {
			const slot = getAvailableSlot(storage, MAXIMUM_STORED);
			if (slot === undefined) {
				return false;
			}
			storage.set(slot, item);
			size += 1;
		}
		if (size > MAXIMUM_STORED) {
			return false;
		}
		return true;
	}

	export function removeItems(storage: Map<Slot, Item>, equipped: Map<Slot, Item>, removing: Array<Slot>): boolean {
		if (!isDraft(storage) || !isDraft(equipped)) {
			return false;
		}
		for (const slot of removing) {
			const item = storage.get(slot);
			if (item !== undefined) {
				// Check to ensure the item is not currently equipped
				let found: Option<Slot>;
				// Search for it...
				for (const [slot, search] of equipped) {
					if (search !== item) {
						continue;
					}
					// It was equipped
					found = slot;
				}
				// Remove it
				found !== undefined && equipped.delete(slot);
			}
			storage.delete(slot);
		}
		return true;
	}

	export function equipSlot(storage: Map<Slot, Item>, equipped: Map<Slot, Item>, slot: Slot): boolean {
		if (!isDraft(storage) || !isDraft(equipped)) {
			return false;
		}
		const item = storage.get(slot);
		if (item === undefined) {
			return false;
		}
		const size = equipped.size();
		const available = getAvailableSlot(equipped, MAXIMUM_EQUIPPED);
		if (size > MAXIMUM_EQUIPPED || available === undefined) {
			return false;
		}
		equipped.set(available, item);
		return true;
	}

	export function unequipSlot(equipped: Map<Slot, Item>, slot: Slot): boolean {
		if (!isDraft(equipped)) {
			return false;
		}
		const item = equipped.get(slot);
		if (item === undefined) {
			return false;
		}
		equipped.delete(slot);
		return true;
	}
}
