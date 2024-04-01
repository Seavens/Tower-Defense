import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { Mob } from "./class";
import { MobUtil } from "shared/mobs/utils";
import { Workspace } from "@rbxts/services";
import { createListener } from "shared/utils/create-listener";
import type { MobDamage, MobStatus } from "shared/mobs/types";
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
		Events.mob.indexReset.connect((index: number): void => {
			MobUtil.setMobIndex(index);
		});
		Events.mob.damage.connect((data: Vector2int16, kind: MobDamage): void => {
			const index = data.X;
			const damage = data.Y;
			const mob = Mob.getMob(index);
			if (mob === undefined) {
				return;
			}
			mob.takeDamage(damage, kind);
		});
		Events.mob.death.connect((index: number): void => {
			const mob = Mob.getMob(index);
			if (mob === undefined) {
				return;
			}
			mob.forceKill();
		});
		Events.mob.statusAdded.connect((data: Vector2int16, status: MobStatus, timestamp: number): void => {
			const index = data.X;
			const duration = data.Y;
			const mob = Mob.getMob(index);
			if (mob === undefined) {
				return;
			}
			const now = Workspace.GetServerTimeNow();
			const delta = now - timestamp;
			mob.applyStatus(status, duration - delta);
		});
		Events.mob.statusRemoved.connect((index: number, status: MobStatus): void => {
			const mob = Mob.getMob(index);
			if (mob === undefined) {
				return;
			}
			mob.removeStatus(status);
		});
		Events.mob.resync.connect((first: Vector2int16, second: Vector2int16): void => {
			const index = first.X;
			const current = first.Y;
			const target = second.X;
			const alpha = second.Y / 1000;
			const mob = Mob.getMob(index);
			if (mob === undefined) {
				return;
			}
		});
	}
}
