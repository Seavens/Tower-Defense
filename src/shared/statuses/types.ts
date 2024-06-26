import { Flamework } from "@flamework/core";
import { t } from "@rbxts/t";

export const enum StatusId {
	// Mobs
	Healing = "status_effect:healing",
	Shielded = "status_effect:shielded",
	Zoinked = "status_effect:zoinked",

	// Towers
	Buffed = "status_effect:buffed",
	Debuffed = "status_effect:debuffed",

	// Shared
	Frozen = "status_effect:frozen",
	Stunned = "status_effect:stunned",
	Slowed = "status_effect:slowed",
}

export const enum StatusKind {
	Tower = "status_kind:tower",
	Mob = "status_kind:mob",
	Shared = "status_kind:shared",
}

export interface Status {
	id: StatusId;
	stacks: number;
	timestamp: number;
	duration: number;
}

export const isStatusId = Flamework.createGuard<StatusId>();
export const isStatusKind = Flamework.createGuard<StatusKind>();

export const isStatus: t.check<Status> = t.strictInterface({
	id: isStatusId,
	stacks: t.number,
	timestamp: t.number,
	duration: t.number,
});
