import { MobDamage } from "shared/mob/types";
import { StatusId } from "shared/statuses/types";
import type { Mob } from "client/mob/class";
import type { Status, StatusKind } from "shared/statuses/types";
import type { StatusModule } from ".";
import type { Tower } from "client/tower";

export const zoinkedStatus: StatusModule<StatusId.Zoinked> = {
	id: StatusId.Zoinked,

	onAdded: (object: Mob | Tower, status: Status, kind: StatusKind): void => {},
	onTick: (object: Mob | Tower, status: Status, kind: StatusKind): void => {
		if (!("takeDamage" in object)) {
			return;
		}
		const mob = object;
		const damage = 100;
		mob.takeDamage(damage, MobDamage.Magic);
	},
	onRemove: (object: Mob | Tower, status: Status, kind: StatusKind): void => {},
};
