import { DamageKind } from "./damage-kind";
import { Flamework } from "@flamework/core";

export const isDamageKind = Flamework.createGuard<DamageKind>();

export { DamageKind };
