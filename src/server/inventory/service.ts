import { Events } from "server/network";
import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utility";
import { PlayerUtility } from "shared/player/utility";
import { Service } from "@flamework/core";
import { TowerUtility } from "shared/tower/utility";
import { isSlot } from "shared/guards";
import { selectInventoryData } from "./selectors";
import { selectProfileData, selectProfileState } from "server/profile/selectors";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";

@Service({})
export class InventoryService implements OnStart {
	public onStart(): void {
		Events.inventory.lock.connect((player: Player, slot: string): void => {
			if (!isSlot(slot)) {
				return;
			}
			const user = PlayerUtility.getUser(player);
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
			const user = PlayerUtility.getUser(player);
			store.inventoryEquipSlot({ slot }, { user, replicate: true });
		});
		Events.inventory.unequip.connect((player: Player, slot: string): void => {
			if (!isSlot(slot)) {
				return;
			}
			const user = PlayerUtility.getUser(player);
			store.inventoryUnequipSlot({ slot }, { user, replicate: true });
		});
		Events.inventory.sell.connect((player: Player, slot: string): void => {
			if (!isSlot(slot)) return;

			const user = PlayerUtility.getUser(player);
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
