import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { BroadcastMetadata, EntityMetadata } from "../metadata";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ReplicatedTower } from "shared/types/objects";
import type { TowerActions, TowerPlace, TowerSell, TowerSetTargeting, TowerUpgrade } from "../actions";

export interface TowerState {
	placed: Map<string, ReplicatedTower>; // Map<{{Tower UUID}_{Tower Index}}, ReplicatedTower>;
}

const towerState: TowerState = {
	placed: new Map<string, ReplicatedTower>(),
};

export const towerSlice = createProducer<TowerState, TowerActions<TowerState>>(towerState, {
	towerPlace: (
		state: TowerState,
		{ id, uuid, index, key, position, targeting }: TowerPlace,
		{ user }: EntityMetadata & BroadcastMetadata,
	): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower: ReplicatedTower = {
				id,
				uuid,
				position,
				owner: user,
				upgrades: 0,
				index,
				targeting,
				key,
			};
			placed.set(key, tower);
		}),
	towerSell: (state: TowerState, { key }: TowerSell, { user }: EntityMetadata & BroadcastMetadata): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) {
				return;
			}
			placed.delete(key);
		}),
	towerSetTargeting: (
		state: TowerState,
		{ key, targeting }: TowerSetTargeting,
		{ user }: EntityMetadata & BroadcastMetadata,
	): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) {
				return;
			}
			tower.targeting = targeting;
		}),
	towerUpgrade: (
		state: TowerState,
		{ key }: TowerUpgrade,
		{ user }: EntityMetadata & BroadcastMetadata,
	): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) {
				return;
			}
			tower.upgrades += 1;
		}),
});
