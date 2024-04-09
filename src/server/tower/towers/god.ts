import { ItemId } from "shared/inventory/types";
import { MobStatus } from "shared/mob/types";
import { TowerUtility } from "shared/tower/utility";
import type { Mob } from "shared/mob/api";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerModule } from ".";

export const godTower: TowerModule<ItemId.God> = {
	id: ItemId.God,

	onAttack: (tower: ReplicatedTower, target: Mob): void => {
		const { unique } = tower;
		const multiplier = TowerUtility.getLevelMultiplier(unique);
		const duration = 8 + 8 * multiplier;
		target?.applyStatus(MobStatus.Judgement, duration);
		target?.applyStatus(MobStatus.Slowed, duration / 2);
	},
};
