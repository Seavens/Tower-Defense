import { GenerateTower } from "shared/functions/tower-functions";
import { Service } from "@flamework/core";
import { inventorySlice } from "server/state/slices/inventory-slice";
import type { Entity } from "server/classes/entity";
import type { InventoryAddItem } from "shared/state/actions";
import type { OnPlayerAdded } from "./player-service";

@Service({})
export class TestService implements OnPlayerAdded {
	public onPlayerAdded(player: Entity): void {
		for (let i = 1; i < 7; i = i + 1) {
			const tower = GenerateTower(player.id);
			const inventoryItem: InventoryAddItem = {
				item: tower,
				slot: `${i}`,
			};
			warn(tower);

			inventorySlice.inventoryAddItem(inventoryItem, { user: player.user, replicate: true });
			inventorySlice.inventoryEquipItem(inventoryItem, { user: player.user, replicate: true });
		}
	}
}
