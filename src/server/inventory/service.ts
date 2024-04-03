import { Events } from "server/network";
import { PlayerUtil } from "shared/player/utils";
import { Service } from "@flamework/core";
import { isSlot } from "shared/guards";
import { selectInventoryData } from "./selectors";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";

@Service({})
export class InventoryService implements OnStart {
	public onStart(): void {
		Events.inventory.lock.connect((player: Player, slot: string): void => {
			if (!isSlot(slot)) {
				return;
			}
			const user = PlayerUtil.getUser(player);
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
			const user = PlayerUtil.getUser(player);
			store.inventoryEquipSlot({ slot }, { user, replicate: true });
		});
	}
}
