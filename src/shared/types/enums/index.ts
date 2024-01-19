import { BaseAnimation } from "./base-animation";
import { Collision } from "./collision";
import { Flamework } from "@flamework/core";
import { Tag } from "./tags";
import { MapDifficulty } from "./map-difficulty";
import { GameStatus } from "./game-status";

export const isCollision = Flamework.createGuard<Collision>();
export const isBaseAnimation = Flamework.createGuard<BaseAnimation>();
export const isTag = Flamework.createGuard<Tag>();
export const isMapDifficulty = Flamework.createGuard<MapDifficulty>();
export const isGameStatus = Flamework.createGuard<GameStatus>();

export { BaseAnimation, Collision, Tag, MapDifficulty , GameStatus};
