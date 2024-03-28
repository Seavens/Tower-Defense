import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utils";
import { Service } from "@flamework/core";
import { store } from "server/state/store";
import type { Entity } from "server/player/class";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { OnDataLoaded } from "../data/service";

@Service({})
export class TestService implements OnDataLoaded {
	public async onDataLoaded(entity: Entity): Promise<void> {
		task.wait(2);
		for (const index of $range(1, 6)) {
			const { user, id } = entity;
			const slot: Slot = `${index}`;
			const item = ItemUtility.createItem(id, ItemKind.Tower);
			const metadata: EntityMetadata & ReplicationMetadata = { user, replicate: true };
			store.inventoryAddItem({ item, slot }, metadata);
			task.wait();
			store.inventoryEquipItem({ item, slot }, metadata);
		}
		for (const index of $range(1, 200)) {
			const { user, id } = entity;
			const slot: Slot = `${index}`;
			const item = ItemUtility.createItem(id, ItemKind.Tower);
			const metadata: EntityMetadata & ReplicationMetadata = { user, replicate: true };
			store.inventoryAddItem({ item, slot }, metadata);
		}
	}
}
