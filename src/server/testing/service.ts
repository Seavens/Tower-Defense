import { ITEM_RNG_MAX, ITEM_RNG_MIN, MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { ItemId, ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utility";
import { Service } from "@flamework/core";
import { TowerGrade } from "shared/tower/types";
import { TowerUtil } from "shared/tower/utils";
import { USE_MOCK_DATA } from "shared/core/core-constants";
import { selectProfileData } from "server/profile/selectors";
import { store } from "server/state/store";
import type { BroadcastMetadata, EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { Entity } from "server/player/class";
import type { ItemTowerUnique } from "shared/inventory/types";
import type { OnDataLoaded } from "../data/service";
import type { OnStart } from "@flamework/core";

@Service({})
export class TestService implements OnStart, OnDataLoaded {
	public async onDataLoaded(entity: Entity): Promise<void> {
		await entity.getData();
		if (!USE_MOCK_DATA) {
			return;
		}
		const { user, id } = entity;
		const metadata: EntityMetadata & ReplicationMetadata = { user, replicate: true };
		const broadcast: EntityMetadata & BroadcastMetadata = { user, broadcast: true };
		const items = ItemUtility.createItems(id, MAXIMUM_STORED, ItemKind.Tower);
		store.inventoryAddItems({ items }, metadata);
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot: Slot = `${index}`;
			// const item = items[index - 1];
			// warn(
			// 	TowerUtil.getOverallGrade(item.unique as ItemTowerUnique),
			// 	TowerUtil.getGrade(item.unique as ItemTowerUnique, "range"),
			// );
			store.inventoryEquipSlot({ slot }, metadata);
		}

		store.gameAddCurrency({ amount: 100000 }, broadcast);
		store.profileAdjustCoins({ coins: 100000 }, metadata);
		store.profileAdjustGems({ gems: 100000 }, metadata);
	}

	public onStart(): void {}
}
