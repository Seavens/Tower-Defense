import { StatusId } from "shared/statuses/types";
import type { Mob } from "server/mob/class";
import type { Status, StatusKind } from "shared/statuses/types";
import type { StatusModule } from ".";
import type { Tower } from "server/tower/class";

export const debuffedStatus: StatusModule<StatusId.Debuffed> = {
	id: StatusId.Debuffed,

	onAdded: (character: Mob | Tower, status: Status, kind: StatusKind): void => {
		//
	},
	onTick: (character: Mob | Tower, status: Status, kind: StatusKind): void => {
		//
	},
	onRemove: (character: Mob | Tower, status: Status, kind: StatusKind): void => {
		//
	},
};
