import { StatusId } from "shared/statuses/types";
import type { Mob } from "client/mob/class";
import type { Status, StatusKind } from "shared/statuses/types";
import type { StatusModule } from ".";
import type { Tower } from "client/tower";

export const stunnedStatus: StatusModule<StatusId.Stunned> = {
	id: StatusId.Stunned,

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
