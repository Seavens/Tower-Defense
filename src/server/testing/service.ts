import { ITEM_RNG_MAX, ITEM_RNG_MIN, MAXIMUM_EQUIPPED, MAXIMUM_STORED } from "shared/inventory/constants";
import { ItemKind } from "shared/inventory/types";
import { ItemUtil } from "shared/inventory/utils";
import { Service } from "@flamework/core";
import { TowerGrade } from "shared/tower/types";
import { TowerUtil } from "shared/tower/utils";
import { USE_MOCK_DATA } from "shared/core/core-constants";
import { selectProfileData } from "server/profile/selectors";
import { store } from "server/state/store";
import type { Entity } from "server/player/class";
import type { EntityMetadata, ReplicationMetadata } from "shared/replication/metadata";
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
		const items = ItemUtil.createItems(id, MAXIMUM_STORED, ItemKind.Tower);
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

	public onStart(): void {
		const grades = new Map<TowerGrade, number>();
		for (const _ of $range(1, 1000)) {
			const item = ItemUtil.createItem(1, ItemKind.Tower);
			const grade = TowerUtil.getOverallGrade(item.unique as ItemTowerUnique);
			const count = grades.get(grade) ?? 0;
			grades.set(grade, count + 1);
		}
		warn(
			grades.get(TowerGrade.S),
			grades.get(TowerGrade.A),
			grades.get(TowerGrade.B),
			grades.get(TowerGrade.C),
			grades.get(TowerGrade.D),
		);
	}
}
