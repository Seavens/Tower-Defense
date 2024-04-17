import { Events } from "server/network";
import { ItemUtility } from "shared/inventory/utility";
import { Service } from "@flamework/core";
import { isSlot } from "shared/utility/guards";
import { selectInventoryData } from "./selectors";
import { selectProfileData } from "server/players/profile/selectors";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";

@Service({})
export class InventoryService implements OnStart {
	public onStart(): void {
		Events.inventory.lock.connect((player: Player, slot: string): void => {
			if (!isSlot(slot)) {
				return;
			}
			const user = player.Name;
			const state = store.getState(selectInventoryData(user));
			if (state === undefined) {
				return;
			}
			const { stored } = state;
			const item = stored.get(slot);
			if (item === undefined) {
				return;
			}
			const { unique } = item;
			const { kind, locked } = unique;
			store.inventoryPatchSlot({ slot, patch: { kind, locked: !locked } }, { user, replicate: true });
		});
		Events.inventory.equip.connect((player: Player, slot: string): void => {
			if (!isSlot(slot)) {
				return;
			}
			const user = player.Name;
			store.inventoryEquipSlot({ slot }, { user, replicate: true });
		});
		Events.inventory.unequip.connect((player: Player, slot: string): void => {
			if (!isSlot(slot)) {
				return;
			}
			const user = player.Name;
			store.inventoryUnequipSlot({ slot }, { user, replicate: true });
		});
		Events.inventory.sell.connect((player: Player, slot: string): void => {
			if (!isSlot(slot)) return;

			const user = player.Name;
			const invState = store.getState(selectInventoryData(user));
			if (invState === undefined || !invState.stored.has(slot)) return;

			const profState = store.getState(selectProfileData(user));
			if (profState === undefined) return;
			const { stored } = invState;
			const item = stored.get(slot);
			if (item === undefined) return;

			const { coins } = profState;
			if (coins === undefined) return;

			const { unique } = item;
			const { locked } = unique;
			if (locked) return;

			const cost = ItemUtility.getItemValue(item.id, unique);
			store.inventoryRemoveItems({ slots: [slot] }, { user, replicate: true });
			store.profileAdjustCoins({ coins: cost }, { user, replicate: true });
		});
	}
}
