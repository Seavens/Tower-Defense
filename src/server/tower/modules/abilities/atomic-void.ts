import { Events } from "server/network";
import { Mob } from "server/mob/class";
import { RunService } from "@rbxts/services";
import { StatusId } from "shared/statuses/types";
import { TowerAbility } from "shared/inventory/towers/abilities/types";
import { TowerTargeting } from "shared/tower/types";
import { store } from "server/state/store";
import type { AbilityModule } from ".";
import type { Tower } from "server/tower/class";

export const atomicVoidAbility: AbilityModule<TowerAbility.AtomicVoid> = {
	id: TowerAbility.AtomicVoid,

	getTarget: (tower: Tower): Option<Mob> => {
		const target = tower.getTarget(TowerTargeting.Strongest);
		return target;
	},
	useAbility: (tower: Tower, target: Option<Mob | Tower>): void => {
		if (target === undefined || target instanceof Mob === false) return;
		const { Position } = target.getCFrame();

		const mobs = Mob.getMobsInRadius(Position, 10);
		for (const mob of mobs) {
			const uuid = mob.Object.getUUID();
			store.addStatus(
				{ id: StatusId.Zoinked, duration: 3, stacks: 1, timestamp: os.clock() },
				{ user: uuid, broadcast: true },
			);
		}
		Events.tower.ability.broadcast(tower.getKey(), TowerAbility.AtomicVoid, target.getUUID());
	},
};
