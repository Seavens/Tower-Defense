import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utility";
import { MAXIMUM_STORED } from "shared/inventory/constants";
import { Service } from "@flamework/core";
import { USE_MOCK_DATA } from "shared/core/constants";
import { store } from "server/state/store";
import type { BroadcastMetadata, ReplicationMetadata, UserMetadata } from "shared/replication/metadata";
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
		const items = ItemUtility.createItems(UserId, MAXIMUM_STORED - 1, ItemKind.Tower);
		store.inventoryAddItems({ items }, metadata);
		store.gameAddCurrency({ amount: 100000 }, broadcast);
		store.profileAdjustCoins({ coins: 100000 }, metadata);
		store.profileAdjustGems({ gems: 100000 }, metadata);
	}

	public onStart(): void {}
}
