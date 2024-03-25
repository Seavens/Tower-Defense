import type { BroadcastMetadata, EntityMetadata } from "shared/replication/metadata";
import type { TowerId, TowerTargeting } from "./types";

export type TowerActions<S> = {
	placeTower: (state: S, payload: TowerPlace, metadata: EntityMetadata & BroadcastMetadata) => S;
	upgradeTower: (state: S, payload: TowerUpgrade, metadata: EntityMetadata & BroadcastMetadata) => S;
	sellTower: (state: S, payload: TowerSell, metadata: EntityMetadata & BroadcastMetadata) => S;
	setTowerTargeting: (state: S, payload: TowerSetTargeting, metadata: EntityMetadata & BroadcastMetadata) => S;
};

export interface TowerPlace {
	id: TowerId;
	uuid: string;
	index: number;
	key: string;
	position: Vector3;
	targeting: TowerTargeting;
}

export interface TowerUpgrade {
	key: string;
}

export interface TowerSell {
	key: string;
}

export interface TowerSetTargeting {
	key: string;
	targeting: TowerTargeting;
}
