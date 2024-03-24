import { Flamework } from "@flamework/core";
import { isTowerId } from "../ids";
import { t } from "@rbxts/t";
import type { Party, PartyInvite } from "./party";
import type { ReplicatedTower, TowerObject } from "./tower";

export const isTowerObject: t.check<TowerObject> = t.strictInterface({
	id: isTowerId,
	owner: t.number,
	original: t.number,

	damage: t.number,
	range: t.number,
	cooldown: t.number,

	uuid: t.string,
	timestamp: t.string,

	level: t.number,
	cost: t.number,
	locked: t.boolean,
});
export const isReplicatedTower: t.check<ReplicatedTower> = t.strictInterface({
	id: isTowerId,
	uuid: t.string,
	owner: t.string,
	position: t.Vector3,
	upgrades: t.number,
	index: t.number,
});

export const isParty = Flamework.createGuard<Party>();
export const isPartyInvite = Flamework.createGuard<PartyInvite>();

export type { Party, PartyInvite, TowerObject, ReplicatedTower };
