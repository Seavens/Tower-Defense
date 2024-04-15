// import { ItemId } from "shared/inventory/types";
// import { MobStatus } from "shared/mob/types";
// import { TowerUtility } from "shared/tower/utility";
// import type { AbilityModule } from ".";
// import type { Mob } from "shared/mob/api";
// import type { ReplicatedTower } from "shared/tower/types";

// export const bluntTower: AbilityModule<ItemId.Blunt> = {
// 	id: ItemId.Blunt,

// 	onAttack: (tower: ReplicatedTower, target: Mob): void => {
// 		const { unique } = tower;
// 		const multiplier = TowerUtility.getLevelMultiplier(unique);
// 		const duration = 2.5 + 2.5 * multiplier;
// 		target.applyStatus(MobStatus.Frozen, duration);
// 	},
// };
