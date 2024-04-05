import { Flamework } from "@flamework/core";
import { number } from "@rbxts/react/src/prop-types";

export const enum MobId {
	Zombie = "mob_id:zombie",
}

export interface MobData {
	uuid: UUID;
	id: MobId;
	health: number;
	current: number;
	target: number;
	final: number;
	elapsed: number;
	duration: number;
	statuses: Map<MobStatus, number>;
}

export const enum MobDamage {
	Sharp = "mob_damage:sharp",
	Blunt = "mob_damage:blunt",
	Magic = "mob_damage:magic",
	Projectile = "mob_damage:projectile",
}

export const enum MobStatus {
	Slowed = "mob_status:slowed",
	Fast = "mob_status:fast",
	Frozen = "mob_status:frozen",
}

export const isMobId = Flamework.createGuard<MobId>();
export const isMobDamage = Flamework.createGuard<MobDamage>();
export const isMobStatus = Flamework.createGuard<MobStatus>();
