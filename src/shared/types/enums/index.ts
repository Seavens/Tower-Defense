import { BaseAnimation } from "./base-animation";
import { Collision } from "./collision";
import { Flamework } from "@flamework/core";
import { Tag } from "./tags";

export const isCollision = Flamework.createGuard<Collision>();
export const isBaseAnimation = Flamework.createGuard<BaseAnimation>();
export const isTag = Flamework.createGuard<Tag>();

export { BaseAnimation, Collision, Tag };
