import { ITEM_RNG_MAX, ITEM_RNG_MIN, MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { ItemId, ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utility";
import { Service } from "@flamework/core";
import { TowerGrade } from "shared/tower/types";
import { TowerUtility } from "shared/tower/utility";
import { USE_MOCK_DATA } from "shared/core/constants";
import { createUUID } from "shared/utility/create-uuid";
import { selectProfileData } from "server/profile/selectors";
import { store } from "server/state/store";
import type { BroadcastMetadata, EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
import type { Entity } from "server/player/class";
import type { Item, ItemTowerUnique } from "shared/inventory/types";
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
		// const broadcast: EntityMetadata & BroadcastMetadata = { user, broadcast: true };
		// const items = ItemUtility.createItems(id, MAXIMUM_STORED, ItemKind.Tower);
		// store.inventoryAddItems({ items }, metadata);
		const s100: ItemTowerUnique = {
			cooldown: ITEM_RNG_MIN,
			damage: ITEM_RNG_MAX,
			range: ITEM_RNG_MAX,
			experience: 1,
			kind: ItemKind.Tower,
			level: 100,
			locked: true,
			owner: 1,
		};
		const itemS100: Item = {
			id: ItemId.Blunt,
			unique: s100,
			uuid: createUUID(),
		};
		const s1: ItemTowerUnique = {
			cooldown: ITEM_RNG_MIN,
			damage: ITEM_RNG_MAX,
			range: ITEM_RNG_MAX,
			experience: 1,
			kind: ItemKind.Tower,
			level: 1,
			locked: true,
			owner: 1,
		};
		const itemS1: Item = {
			id: ItemId.Blunt,
			unique: s1,
			uuid: createUUID(),
		};
		const d100: ItemTowerUnique = {
			cooldown: ITEM_RNG_MAX,
			damage: ITEM_RNG_MIN,
			range: ITEM_RNG_MIN,
			experience: 1,
			kind: ItemKind.Tower,
			level: 100,
			locked: true,
			owner: 1,
		};
		const itemD100: Item = {
			id: ItemId.Blunt,
			unique: d100,
			uuid: createUUID(),
		};
		const d1: ItemTowerUnique = {
			cooldown: ITEM_RNG_MAX,
			damage: ITEM_RNG_MIN,
			range: ITEM_RNG_MIN,
			experience: 1,
			kind: ItemKind.Tower,
			level: 1,
			locked: true,
			owner: 1,
		};
		const itemD1: Item = {
			id: ItemId.Blunt,
			unique: d1,
			uuid: createUUID(),
		};
		warn("s100", ItemUtility.getItemValue(ItemId.Blunt, s100), TowerUtility.getOverallGrade(s100));
		warn("s1", ItemUtility.getItemValue(ItemId.Blunt, s1), TowerUtility.getOverallGrade(s1));
		warn("d100", ItemUtility.getItemValue(ItemId.Blunt, d100), TowerUtility.getOverallGrade(d100));
		warn("d1", ItemUtility.getItemValue(ItemId.Blunt, d1), TowerUtility.getOverallGrade(d1));
		store.inventoryAddItems({ items: [itemS100, itemS1, itemD1, itemD100] }, metadata);
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot: Slot = `${index}`;
			// const item = items[index - 1];
			// warn(
			// 	TowerUtil.getOverallGrade(item.unique as ItemTowerUnique),
			// 	TowerUtil.getGrade(item.unique as ItemTowerUnique, "range"),
			// );
			// store.inventoryEquipSlot({ slot }, metadata);
		}

		// store.gameAddCurrency({ amount: 100000 }, broadcast);
		store.profileAdjustCoins({ coins: 100000 }, metadata);
		store.profileAdjustGems({ gems: 100000 }, metadata);
	}

	public onStart(): void {}
}
