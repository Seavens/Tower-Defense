// import { ItemId } from "shared/inventory/types";
// import { Mob } from "server/mob/class/class";
// import { MobDamage, MobStatus } from "shared/mob/types";
// import { TowerUtility } from "shared/tower/utility";
// import type { AbilityModule } from ".";
// import type { ReplicatedTower } from "shared/tower/types";

// export const godTower: AbilityModule<ItemId.God> = {
// 	id: ItemId.God,

// 	onAbility: (tower: ReplicatedTower, target: Mob): void => {
// 		const { unique } = tower;
// 		const multiplier = TowerUtility.getLevelMultiplier(unique);
// 		const duration = 8 + 8 * multiplier;
// 		const position = target.getCFrame().Position;
// 		const radius = TowerUtility.getTotalRange(tower);
// 		const mobs = Mob.getMobsInRadius(position, radius / 3);
// 		for (const node of mobs) {
// 			const mob = node.Object;
// 			mob.takeDamage(TowerUtility.getTotalDamage(tower) * 0.5, MobDamage.Magic);
// 			target?.applyStatus(MobStatus.Judgement, duration);
// 			target?.applyStatus(MobStatus.Slowed, duration / 2);
// 		}
// 	},
// };
