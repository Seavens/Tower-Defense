import { StatusId } from "shared/statuses/types";
import { buffedStatus } from "./buffed";
import { debuffedStatus } from "./debuffed";
import { frozenStatus } from "./frozen";
import { healingStatus } from "./healing";
import { shieldedStatus } from "./shielded";
import { slowedStatus } from "./slowed";
import { stunnedStatus } from "./stunned";
import { zonikedStatus } from "./zoinked";
import type { Mob } from "server/mob/class";
import type { Status, StatusKind } from "shared/statuses/types";
import type { Tower } from "server/tower/class";

export interface StatusModule<I extends StatusId> {
	id: I;

	onAdded: {
		(owner: Tower | Mob, status: Status, kind: StatusKind.Shared): void;
		(owner: Tower, status: Status, kind: StatusKind.Tower): void;
		(owner: Mob, status: Status, kind: StatusKind.Mob): void;
	};
	onTick: {
		(owner: Tower | Mob, status: Status, kind: StatusKind.Shared): void;
		(owner: Tower, status: Status, kind: StatusKind.Tower): void;
		(owner: Mob, status: Status, kind: StatusKind.Mob): void;
	};
	onRemove: {
		(owner: Tower | Mob, status: Status, kind: StatusKind.Shared): void;
		(owner: Tower, status: Status, kind: StatusKind.Tower): void;
		(owner: Mob, status: Status, kind: StatusKind.Mob): void;
	};
}

export const statusModules: { [I in StatusId]: StatusModule<I> } = {
	[StatusId.Healing]: healingStatus,
	[StatusId.Debuffed]: debuffedStatus,
	[StatusId.Buffed]: buffedStatus,
	[StatusId.Frozen]: frozenStatus,
	[StatusId.Slowed]: slowedStatus,
	[StatusId.Stunned]: stunnedStatus,
	[StatusId.Shielded]: shieldedStatus,
	[StatusId.Zoinked]: zonikedStatus,
} as const;
