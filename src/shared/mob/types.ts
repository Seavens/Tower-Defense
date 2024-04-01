import { Flamework } from "@flamework/core";

export const enum MobId {
	Zombie = "mob_id:zombie",
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
