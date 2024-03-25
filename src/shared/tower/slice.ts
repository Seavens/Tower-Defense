import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { EntityMetadata } from "shared/replication/metadata";
import type { ReplicatedTower } from "./types";
import type { TowerActions, TowerPlace, TowerSell, TowerSetTargeting, TowerUpgrade } from "./actions";

export interface TowerState {
	placed: Map<string, ReplicatedTower>; // Map<{{Tower UUID}_{Tower Index}}, ReplicatedTower>;
}

const towerState: TowerState = {
	placed: new Map<string, ReplicatedTower>(),
};

export const towerSlice = createProducer<TowerState, TowerActions<TowerState>>(towerState, {
	placeTower: (
		state: TowerState,
		{ id, uuid, index, key, position, targeting }: TowerPlace,
		{ user }: EntityMetadata,
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
	sellTower: (state: TowerState, { key }: TowerSell, { user }: EntityMetadata): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) {
				return;
			}
			placed.delete(key);
		}),
	setTowerTargeting: (
		state: TowerState,
		{ key, targeting }: TowerSetTargeting,
		{ user }: EntityMetadata,
	): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) {
				return;
			}
			tower.targeting = targeting;
		}),
	upgradeTower: (state: TowerState, { key }: TowerUpgrade, { user }: EntityMetadata): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) {
				return;
			}
			tower.upgrades += 1;
		}),
});
