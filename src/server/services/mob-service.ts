import { Listener } from "shared/classes/listener";
import { Mob } from "server/classes/mob";
import { Service } from "@flamework/core";
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

const mobAdded = new Listener<OnMobAdded>();
const mobRemoved = new Listener<OnMobRemoved>();
const mobEnded = new Listener<OnMobEnded>();
const mobDied = new Listener<OnMobDied>();

@Service({})
export class MobService implements OnStart {
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
	}
}
