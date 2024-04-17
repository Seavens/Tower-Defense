import type { BroadcastMetadata, UserMetadata } from "shared/state/replication/metadata";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { TowerTargeting } from "./types";

export type TowerActions<S> = {
	towerPlace: (state: S, payload: TowerPlace, metadata: UserMetadata & BroadcastMetadata) => S;
	towerUpgrade: (state: S, payload: TowerUpgrade, metadata: UserMetadata & BroadcastMetadata) => S;
	towerSell: (state: S, payload: TowerSell, metadata: UserMetadata & BroadcastMetadata) => S;
	towerSetTargeting: (state: S, payload: TowerSetTargeting, metadata: UserMetadata & BroadcastMetadata) => S;
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
