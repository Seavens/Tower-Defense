import { Flamework } from "@flamework/core";

export const enum MobId {
	Rat = "mob_id:rat",
	Alien = "mob_id:alien",
	Monkey = "mob_id:monkey",
	Grimace = "mob_id:grimace",
}

export interface MobData {
	id: MobId;
	health: number;
	current: number;
	alpha: number;
	timestamp: number;
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
	Judgement = "mob_status:judgement",
}

export const enum MobAnimation {
	Walk = "mob_animation:walk",
}

export const isMobId = Flamework.createGuard<MobId>();
export const isMobDamage = Flamework.createGuard<MobDamage>();
export const isMobStatus = Flamework.createGuard<MobStatus>();
export const isMobAnimation = Flamework.createGuard<MobAnimation>();
