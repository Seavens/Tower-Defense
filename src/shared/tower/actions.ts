import type { BroadcastMetadata, EntityMetadata } from "shared/replication/metadata";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { TowerTargeting } from "./types";

export type TowerActions<S> = {
	towerPlace: (state: S, payload: TowerPlace, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerUpgrade: (state: S, payload: TowerUpgrade, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerSell: (state: S, payload: TowerSell, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerSetTargeting: (state: S, payload: TowerSetTargeting, metadata: EntityMetadata & BroadcastMetadata) => S;
	towerAddExperience: (state: S, payload: TowerAddExperience, metadata: BroadcastMetadata) => S;
};

export interface TowerPlace {
	id: TowerItemId;
	uuid: UUID;
	index: number;
	key: string;
	position: Vector3;
	targeting: TowerTargeting;
	unique: ItemTowerUnique;
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

export interface TowerAddExperience {
	key: string;
	amount: number;
}
