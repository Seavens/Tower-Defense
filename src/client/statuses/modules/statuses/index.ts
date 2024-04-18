import { StatusId } from "shared/statuses/types";
import { buffedStatus } from "./buffed";
import { debuffedStatus } from "./debuffed";
import { frozenStatus } from "./frozen";
import { healingStatus } from "./healing";
import { shieldedStatus } from "./shielded";
import { slowedStatus } from "./slowed";
import { stunnedStatus } from "./stunned";
import type { CharacterRigR15 } from "@rbxts/promise-character";
import type { Status } from "shared/statuses/types";

export interface StatusModule<I extends StatusId> {
	id: I;

	onAdded: (character: CharacterRigR15, status: Status) => void;
	onTick: (character: CharacterRigR15, status: Status) => void;
	onRemove: (character: CharacterRigR15, status: Status) => void;
}

export const statusModules: { [I in StatusId]: StatusModule<I> } = {
	[StatusId.Healing]: healingStatus,
	[StatusId.Debuffed]: debuffedStatus,
	[StatusId.Buffed]: buffedStatus,
	[StatusId.Frozen]: frozenStatus,
	[StatusId.Slowed]: slowedStatus,
	[StatusId.Stunned]: stunnedStatus,
	[StatusId.Shielded]: shieldedStatus,
} as const;
