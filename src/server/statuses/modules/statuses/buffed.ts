import { StatusId, StatusKind } from "shared/statuses/types";
import type { Mob } from "server/mob/class";
import type { Status } from "shared/statuses/types";
import type { StatusModule } from ".";
import type { Tower } from "server/tower/class";

export const buffedStatus: StatusModule<StatusId.Buffed> = {
	id: StatusId.Buffed,

	onAdded: (owner: Mob | Tower, { stacks }: Status, kind: StatusKind): void => {
		if (kind !== StatusKind.Tower) {
			return;
		}
		// Typescript moment!
		const tower = owner as Tower;
		tower.setSpeedBuff(3 * stacks);
		warn("added");
	},
	onTick: (owner: Mob | Tower, status: Status, kind: StatusKind): void => {
		//
	},
	onRemove: (owner: Mob | Tower, { stacks }: Status, kind: StatusKind): void => {
		if (kind !== StatusKind.Tower) {
			return;
		}
		const tower = owner as Tower;
		const value = 3 * stacks;
		const buff = tower.getSpeedBuff();
		if (buff !== value) {
			// Buffed again by another tower, still ongoing.
			return;
		}
		tower.setSpeedBuff(0);
		warn("removed");
	},
};
