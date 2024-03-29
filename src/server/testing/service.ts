import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utils";
import { MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { Service } from "@flamework/core";
import { store } from "server/state/store";
import type { Entity } from "server/player/class";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { OnDataLoaded } from "../data/service";

@Service({})
export class TestService implements OnDataLoaded {
	public async onDataLoaded(entity: Entity): Promise<void> {
		task.wait(3);

		// Mock Data
		const { user, id } = entity;
		const metadata: EntityMetadata & ReplicationMetadata = { user, replicate: true };

		for (const index of $range(1, MAXIMUM_STORED)) {
			const item = ItemUtility.createItem(id, ItemKind.Tower);
			store.inventoryAddItem({ items: [item] }, metadata);
		}

		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const item = ItemUtility.createItem(id, ItemKind.Tower);
			store.inventoryAddItem({ items: [item] }, metadata);
		}

		store.profileAdjustCoins({ isAdd: true, coins: 1000 }, metadata);
	}
}
