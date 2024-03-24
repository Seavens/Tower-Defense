import type { BroadcastMetadata, EntityMetadata } from "../metadata";
import type { TowerId } from "shared/types/ids";

export type TowerActions<S> = {
	towerPlace: (state: S, payload: TowerPlace, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerUpgrade: (state: S, payload: TowerUpgrade, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerSell: (state: S, payload: TowerSell, metadata: EntityMetadata & BroadcastMetadata) => S;
};

export interface TowerPlace {
	uuid: string;
	id: TowerId;
	position: Vector3;
	index: number;
}

export interface TowerUpgrade {
	uuid: string;
	index: number;
}

export interface TowerSell {
	uuid: string;
	index: number;
}
