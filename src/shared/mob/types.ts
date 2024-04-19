import { Flamework } from "@flamework/core";

export const enum MobId {
	UrbanOne = "mob_id:urban_one",
	UrbanTwo = "mob_id:urban_two",
	UrbanThree = "mob_id:urban_three",
	SoldierOne = "mob_id:soldier_one",
	SoldierTwo = "mob_id:soldier_two",
	SoldierThree = "mob_id:soldier_three",
	NavyOne = "mob_id:navy_one",
	NavyTwo = "mob_id:navytwo",
	NavyThree = "mob_id:navy_three",
	NavyFour = "mob_id:navy_four",
	AirforceOne = "mob_id:airforce_one",
	AirforceTwo = "mob_id:airforce_two",
	AirforceThree = "mob_id:airforce_three",
	AirforceFour = "mob_id:airforce_four",
}

export interface MobData {
	id: MobId;
	health: number;
	current: number;
	alpha: number;
	timestamp: number;
}

export const enum MobDamage {
	Sharp = "mob_damage:sharp",
	Blunt = "mob_damage:blunt",
	Magic = "mob_damage:magic",
	Projectile = "mob_damage:projectile",
	None = "mob_damage:none",
}

export const enum MobAnimation {
	Walk = "mob_animation:walk",
}

export const isMobId = Flamework.createGuard<MobId>();
export const isMobDamage = Flamework.createGuard<MobDamage>();
export const isMobAnimation = Flamework.createGuard<MobAnimation>();
