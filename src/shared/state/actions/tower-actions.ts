import type { BroadcastMetadata, EntityMetadata } from "../metadata";
import type { TargetId, TowerId } from "shared/types/ids";

export type TowerActions<S> = {
	towerPlace: (state: S, payload: TowerPlace, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerUpgrade: (state: S, payload: TowerUpgrade, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerSell: (state: S, payload: TowerSell, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerSetTargeting: (state: S, payload: TowerSetTargeting, metadata: EntityMetadata & BroadcastMetadata) => S;
};

export interface TowerPlace {
	id: TowerId;
	uuid: string;
	index: number;
	key: string;
	position: Vector3;
	targeting: TargetId;
}

export interface TowerUpgrade {
	key: string;
}

export interface TowerSell {
	key: string;
}

export interface TowerSetTargeting {
	key: string;
	targeting: TargetId;
}
