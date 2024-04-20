import { Events } from "server/network";
import { MobDamage } from "shared/mob/types";
import { TowerAbility } from "shared/inventory/towers/abilities/types";
import { TowerTargeting } from "shared/tower/types";
import type { AbilityModule } from ".";
import type { Mob } from "server/mob/class";
import type { Tower } from "server/tower/class";

export const atomicVoidAbility: AbilityModule<TowerAbility.AtomicVoid> = {
	id: TowerAbility.AtomicVoid,

	getTarget: (tower: Tower): Option<Mob | Tower> => {
		const target = tower.getTarget(TowerTargeting.Strongest);
		return target;
	},
	useAbility: (tower: Tower, target: Option<Mob | Tower>): void => {
		if (target === undefined || "key" in target) {
			return;
		}
		const key = tower.getKey();
		const uuid = target.getUUID();
		target.takeDamage(12894978123489, MobDamage.Magic, key);
		Events.tower.ability.broadcast(key, TowerAbility.AtomicVoid, uuid);
	},
};
