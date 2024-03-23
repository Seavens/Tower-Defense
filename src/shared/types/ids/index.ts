import { AnimationId } from "./animation-id";
import { AttackId } from "./attack-id";
import { Flamework } from "@flamework/core";
import { MapId } from "./map-id";
import { MobId } from "./mob-id";
import { StatusId } from "./status-id";
import { TowerId } from "./tower-id";
import type { TargetId } from "./target-id";

export const isAnimationId = Flamework.createGuard<AnimationId>();
export const isTowerId = Flamework.createGuard<TowerId>();
export const isMobId = Flamework.createGuard<MobId>();
export const isMapId = Flamework.createGuard<MapId>();
export const isStatusId = Flamework.createGuard<StatusId>();
export const isAttackId = Flamework.createGuard<AttackId>();
export const isTargetId = Flamework.createGuard<TargetId>();

export { AnimationId, TowerId, MobId, MapId, StatusId, AttackId, TargetId };
