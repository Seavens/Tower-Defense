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
		const items = ItemUtility.createItems(id, MAXIMUM_STORED, ItemKind.Tower);
		store.inventoryAddItems({ items }, metadata);
		task.wait();
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot: Slot = `${index}`;
			store.inventoryEquipSlot({ slot }, metadata);
		}

		store.profileAddExperience({ experience: 100000 }, metadata);
		store.profileAdjustCoins({ coins: 100000 }, metadata);
		store.profileAdjustGems({ gems: 100000 }, metadata);
	}
}
