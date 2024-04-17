import { itemDefinitions } from "shared/inventory";
import { selectInventoryData } from "server/inventory/selectors";
import { store } from "server/state/store";
import type { Item } from "shared/inventory/types";
import type { Tower } from "./class";
import type { TowerTargeting } from "shared/tower/types";

export namespace TowerInventoryUtility {
	export function getTowerItem(player: Player, uuid: UUID): Option<Item> {
		const user = player.Name;
		const { stored, equipped } = store.getState(selectInventoryData(user));
		let result: Option<Item>;
		for (const slot of equipped) {
			const item = stored.get(slot);
			if (item === undefined || item.uuid !== uuid) {
				continue;
			}
			result = item;
			break;
		}
		return result;
	}

	export function getTowerSlot(player: Player, uuid: UUID): Option<Slot> {
		const user = player.Name;
		const { stored, equipped } = store.getState(selectInventoryData(user));
		let result: Option<Slot>;
		for (const slot of equipped) {
			const item = stored.get(slot);
			if (item === undefined || item.uuid !== uuid) {
				continue;
			}
			result = slot;
			break;
		}
		return result;
	}
}
