import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utils";
import { MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { Service } from "@flamework/core";
import { USE_MOCK_DATA } from "shared/core/core-constants";
import { selectProfileData } from "server/profile/selectors";
import { store } from "server/state/store";
import type { Entity } from "server/player/class";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { OnDataLoaded } from "../data/service";

@Service({})
export class TestService implements OnDataLoaded {
	public async onDataLoaded(entity: Entity): Promise<void> {
		await entity.getData();
		if (!USE_MOCK_DATA) {
			return;
		}
		const { user, id } = entity;
		const metadata: EntityMetadata & ReplicationMetadata = { user, replicate: true };
		for (const _ of $range(1, MAXIMUM_STORED)) {
			const item = ItemUtility.createItem(id, ItemKind.Tower);
			store.inventoryAddItem({ items: [item] }, metadata);
		}
		warn(`Added ${MAXIMUM_STORED} items to ${user}.\n`);

		for (const _ of $range(1, MAXIMUM_EQUIPPED)) {
			const item = ItemUtility.createItem(id, ItemKind.Tower);
			store.inventoryAddItem({ items: [item] }, metadata);
		}
		warn(`Added ${MAXIMUM_EQUIPPED} items to ${user}.\n`);

		store.profileAddExperience({ experience: 100000 }, metadata);
		store.profileAdjustCoins({ coins: 100000 }, metadata);
		store.profileAdjustGems({ gems: 100000 }, metadata);

		warn("Added 100000 experience, coins, and gems to player.\n");
		warn(store.getState(selectProfileData(user)));
		task.wait();
		store.profileAdjustCoins({ coins: -1000000 }, metadata);
		store.profileAdjustGems({ gems: -1000000 }, metadata);

		warn("Removed 1000000 coins and gems from player.\n");
		task.wait();
		warn(store.getState(selectProfileData(user)));
	}
}
