import { AnimationId } from "./animation-id";
import { Flamework } from "@flamework/core";

export const isAnimationId = Flamework.createGuard<AnimationId>();

export { AnimationId };
