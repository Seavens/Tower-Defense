import { Dictionary } from "@rbxts/sift";
import { type Item, ItemKind, type ItemUnique } from "./types";
import { MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "./constants";
import { find, remove } from "@rbxts/immut/src/table";
import Immut, { createDraft, isDraft } from "@rbxts/immut";

export namespace InventoryImpl {
	export function getAvailableSlot(storage: Map<Slot, Item>): Option<Slot> {
		let available: Option<Slot>;
		for (const index of $range(1, MAXIMUM_STORED)) {
			const slot: Slot = `${index}`;
			if (storage.has(slot)) {
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
			const slot = getAvailableSlot(storage);
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

	export function removeItems(storage: Map<Slot, Item>, equipped: Array<Slot>, removing: Array<Slot>): boolean {
		if (!isDraft(storage) || !isDraft(equipped)) {
			return false;
		}
		for (const slot of removing) {
			const index = find(equipped, slot);
			if (index === undefined) {
				remove(equipped, index);
			}
			storage.delete(slot);
		}
		return true;
	}

	export function equipSlot(storage: Map<Slot, Item>, equipped: Array<Slot>, slot: Slot): boolean {
		if (!isDraft(storage) || !isDraft(equipped)) {
			return false;
		}
		const item = storage.get(slot);
		if (item === undefined || Immut.table.find(equipped, slot) !== undefined) {
			return false;
		}
		const { unique } = item;
		const { kind } = unique;
		const size = equipped.size();
		if (size >= MAXIMUM_EQUIPPED || kind !== ItemKind.Tower) {
			return false;
		}
		Immut.table.insert(equipped, slot);
		return true;
	}

	export function unequipSlot(equipped: Array<Slot>, slot: Slot): boolean {
		if (!isDraft(equipped)) {
			return false;
		}
		const index = find(equipped, slot);
		if (index === undefined) {
			return false;
		}
		remove(equipped, index);
		return true;
	}

	export function patchSlot(storage: Map<Slot, Item>, slot: Slot, patch: Partial<ItemUnique>): boolean {
		if (!isDraft(storage)) {
			return false;
		}
		const item = storage.get(slot);
		if (item === undefined) {
			return false;
		}
		const { unique } = item;
		const { kind } = unique;
		if (kind !== patch.kind) {
			return false;
		}
		const current = Immut.current(unique);
		item.unique = { ...current, ...patch } as ItemUnique;
		return true;
	}
}
