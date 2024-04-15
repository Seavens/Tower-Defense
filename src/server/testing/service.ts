import { ITEM_RNG_MAX, ITEM_RNG_MIN, MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { ItemId, ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utility";
import { MAX_TOWER_LEVEL } from "shared/tower/constants";
import { Service } from "@flamework/core";
import { USE_MOCK_DATA } from "shared/core/constants";
import { createUUID } from "shared/utility/create-uuid";
import { store } from "server/state/store";
import type { BroadcastMetadata, ReplicationMetadata, UserMetadata } from "shared/replication/metadata";
import type { Item, ItemTowerUnique } from "shared/inventory/types";
import type { OnDataLoaded } from "../data/service";
import type { OnStart } from "@flamework/core";

@Service({})
export class TestService implements OnStart, OnDataLoaded {
	public async onDataLoaded(player: Player): Promise<void> {
		if (!USE_MOCK_DATA) {
			return;
		}
		const { Name, UserId } = player;
		const metadata: UserMetadata & ReplicationMetadata = { user: Name, replicate: true };
		const broadcast: UserMetadata & BroadcastMetadata = { user: Name, broadcast: true };
		const items = ItemUtility.createItems(UserId, MAXIMUM_STORED - 3, ItemKind.Tower);
		for (const _ of $range(1, 3)) {
			const unique: ItemTowerUnique = {
				kind: ItemKind.Tower,
				cooldown: ITEM_RNG_MIN,
				damage: ITEM_RNG_MAX,
				range: ITEM_RNG_MAX,
				level: MAX_TOWER_LEVEL,
				experience: 0,
				locked: true,
				owner: UserId,
			};
			const tower: Item = {
				id: ItemId.EternalDamnation,
				unique,
				uuid: createUUID(),
			};
			store.inventoryAddItems({ items: [tower] }, metadata);
		}
		store.inventoryAddItems({ items }, metadata);
		store.gameAddCurrency({ amount: 10000000 }, broadcast);
		store.profileAdjustCoins({ coins: 100000 }, metadata);
		store.profileAdjustGems({ gems: 100000 }, metadata);
	}

	public onStart(): void {}
}
