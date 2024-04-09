import { Flamework } from "@flamework/core";

export const enum Collision {
	Character = "collision:character",

	Mob = "collision:mob",

	Tower = "collision:tower",

	Spawn = "collision:spawn",

	Debris = "collision:debris",
}

export const isCollision = Flamework.createGuard<Collision>();
