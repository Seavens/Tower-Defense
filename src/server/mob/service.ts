import { Mob } from "server/mob/class";
import { Service } from "@flamework/core";
import { Tower } from "server/tower/class";
import { createListener } from "shared/utility/create-listener";
import { mobDefinitions } from "shared/mob/mobs";
import { selectProfileData } from "server/profile/selectors";
import { store } from "server/state/store";
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
		Mob.onMobDied.Connect((mob: Mob, key?: string): void => {
			mobDied.fire(mob);
			if (key === undefined) {
				return;
			}
			const { id } = mob;
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				return;
			}
			const { owner } = tower;
			const { bounty } = mobDefinitions[id];
			store.gameAddCurrency({ amount: bounty }, { user: owner, broadcast: true });
		});
	}
}
