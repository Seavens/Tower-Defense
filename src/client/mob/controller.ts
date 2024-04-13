import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { Mob } from "./class/class";
import { Workspace } from "@rbxts/services";
import { createListener } from "shared/utility/create-listener";
import type { MobDamage, MobId, MobStatus } from "shared/mob/types";
import type { OnStart } from "@flamework/core";

/** @hideinherited */
export interface OnMobAdded {
	onMobAdded(mob: Mob): void;
}

/** @hideinherited */
export interface OnMobRemoved {
	onMobRemoved(mob: Mob): void;
}

/** @hideinherited */
export interface OnMobEnded {
	onMobEnded(mob: Mob): void;
}

/** @hideinherited */
export interface OnMobDied {
	onMobDied(mob: Mob): void;
}

const mobAdded = createListener<OnMobAdded>();
const mobRemoved = createListener<OnMobRemoved>();
const mobEnded = createListener<OnMobEnded>();
const mobDied = createListener<OnMobDied>();

@Controller({})
export class MobController implements OnStart {
	public onStart(): void {
		Mob.onMobAdded.Connect((mob: Mob): void => {
			mobAdded.fire(mob);
		});
		Mob.onMobRemoved.Connect((mob: Mob): void => {
			mobRemoved.fire(mob);
		});
		Mob.onMobEnded.Connect((mob: Mob): void => {
			mobEnded.fire(mob);
		});
		Mob.onMobDied.Connect((mob: Mob): void => {
			mobDied.fire(mob);
		});
		Events.mob.damage.connect((uuid: UUID, damage: number, kind: MobDamage): void => {
			const mob = Mob.getMob(uuid);
			if (mob === undefined) {
				return;
			}
			mob.takeDamage(damage, kind);
		});
		Events.mob.death.connect((uuid: UUID): void => {
			const mob = Mob.getMob(uuid);
			if (mob === undefined) {
				return;
			}
			mob.forceKill();
		});
		Events.mob.statusAdded.connect((uuid: UUID, duration: number, status: MobStatus, timestamp: number): void => {
			const mob = Mob.getMob(uuid);
			if (mob === undefined) {
				return;
			}
			const now = Workspace.GetServerTimeNow();
			const delta = now - timestamp;
			mob.applyStatus(status, duration - delta);
		});
		Events.mob.statusRemoved.connect((uuid: UUID, status: MobStatus): void => {
			const mob = Mob.getMob(uuid);
			if (mob === undefined) {
				return;
			}
			mob.removeStatus(status);
		});
		Events.mob.resync.connect((uuid: UUID, current: number, alpha: number, timestamp: number): void => {
			const mob = Mob.getMob(uuid);
			if (mob === undefined) {
				return;
			}
			mob.calculateDuration();
			const now = Workspace.GetServerTimeNow();
			const duration = mob.getDuration();
			let delta = now - timestamp;
			while (delta > duration) {
				current += 1;
				delta -= duration;
			}
			if (current > 1) {
				const waypoints = mob.getWaypoints();
				mob.nextWaypoint(current, waypoints.size());
			}
			delta > 0 && mob.setAlpha(alpha, delta);
		});
		Events.mob.spawned.connect((id: MobId, uuid: UUID, timestamp: number): void => {
			const now = Workspace.GetServerTimeNow();
			const mob = new Mob(uuid, id);
			mob.start();
			const duration = mob.getDuration();
			let delta = now - timestamp;
			let current = 1;
			while (delta > duration) {
				current += 1;
				delta -= duration;
			}
			if (current > 1) {
				const waypoints = mob.getWaypoints();
				mob.nextWaypoint(current, waypoints.size());
			}
			delta > 0 && mob.setElapsed(delta);
		});
	}
}
1;
