import { ItemId } from "shared/inventory/types";
import { Mob } from "server/mob/class";
import { MobStatus } from "shared/mob/types";
import { TowerUtility } from "shared/tower/utility";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerModule } from ".";

export const eternalDamnationTower: TowerModule<ItemId.EternalDamnation> = {
	id: ItemId.EternalDamnation,

	onAttack: (tower: ReplicatedTower): void => {
		const { position } = tower;
		const radius = TowerUtility.getTotalRange(tower);
		const mobs = Mob.getMobsInRadius(position, radius);
		for (const node of mobs) {
			const mob = node.Object;
			mob.applyStatus(MobStatus.Frozen, 5);
		}
	},
};
