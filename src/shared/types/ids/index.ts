import { AnimationId } from "./animation-id";
import { Flamework } from "@flamework/core";
import { TowerId } from "./tower-id";
import { MobId } from "./mob-id";
import { MapId } from "./map-id";
import { StatusId } from "./status-id";

export const isAnimationId = Flamework.createGuard<AnimationId>();
export const isTowerId = Flamework.createGuard<TowerId>();
export const isMobId = Flamework.createGuard<MobId>();
export const isMapId = Flamework.createGuard<MapId>();
export const isStatusId = Flamework.createGuard<StatusId>();

export { AnimationId, TowerId, MobId, MapId , StatusId};
