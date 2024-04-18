import { StatusId } from "../../types";
import { buffedStatus } from "./buffed";
import { debuffedStatus } from "./debuffed";
import { frozenStatus } from "./frozen";
import { healingStatus } from "./healing";
import { shieldedStatus } from "./shielded";
import { slowedStatus } from "./slowed";
import { stunnedStatus } from "./stunned";

export interface StatusDefinition<I extends StatusId> {
	id: I;
	name: string;
	desc: string;

	tick: number;
}

export type AnyStatusDefinition = (typeof statusDefinitions)[StatusId];

export const statusDefinitions: { [I in StatusId]: StatusDefinition<I> } = {
	[StatusId.Healing]: healingStatus,
	[StatusId.Shielded]: shieldedStatus,
	[StatusId.Buffed]: buffedStatus,
	[StatusId.Debuffed]: debuffedStatus,
	[StatusId.Frozen]: frozenStatus,
	[StatusId.Stunned]: stunnedStatus,
	[StatusId.Slowed]: slowedStatus,
} as const;
