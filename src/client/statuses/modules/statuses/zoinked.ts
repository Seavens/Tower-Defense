import { Mob } from "client/mob/class";
import { MobDamage } from "shared/mob/types";
import { StatusId } from "shared/statuses/types";
import type { Status, StatusKind } from "shared/statuses/types";
import type { StatusModule } from ".";
import type { Tower } from "client/tower";

export const zonikedStatus: StatusModule<StatusId.Zoinked> = {
	id: StatusId.Zoinked,

	onAdded: (character: Mob | Tower, status: Status, kind: StatusKind): void => {},
	onTick: (character: Mob | Tower, status: Status, kind: StatusKind): void => {
		if (character === undefined || character instanceof Mob === false) return;
		const mob = character;
		const damage = 100;
		mob.takeDamage(damage, MobDamage.Magic);
		warn("Zoinked status ticked");
	},
	onRemove: (character: Mob | Tower, status: Status, kind: StatusKind): void => {},
};
