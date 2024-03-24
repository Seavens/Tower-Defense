import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { BroadcastMetadata, EntityMetadata } from "../metadata";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ReplicatedTower } from "shared/types/objects";
import type { TowerActions, TowerPlace, TowerSell, TowerUpgrade } from "../actions";

export interface TowerState {
	placed: Map<string, Map<string, ReplicatedTower>>; // Map<{Tower UUID}, Map<{Tower Index}, ReplicatedTower>>;
}

const towerState: TowerState = {
	placed: new Map<string, Map<string, ReplicatedTower>>(),
};

export const towerSlice = createProducer<TowerState, TowerActions<TowerState>>(towerState, {
	towerPlace: (
		state: TowerState,
		{ id, position, uuid, index }: TowerPlace,
		{ user }: EntityMetadata & BroadcastMetadata,
	): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			let towers = placed.get(uuid);
			if (towers === undefined) {
				towers = new Map<string, ReplicatedTower>();
				placed.set(uuid, towers);
			}
			const tower: ReplicatedTower = {
				id,
				uuid,
				position,
				owner: user,
				upgrades: 0,
				index,
			};
			towers.set(`${index}`, tower);
		}),
	towerSell: (
		state: TowerState,
		{ uuid, index }: TowerSell,
		{ user }: EntityMetadata & BroadcastMetadata,
	): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const towers = placed.get(uuid);
			if (towers === undefined) {
				return;
			}
			const tower = towers.get(`${index}`);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) {
				return;
			}
			if (towers.size() <= 1) {
				towers.clear();
				placed.delete(uuid);
			}
			towers.delete(`${index}`);
		}),
	towerUpgrade: (
		state: TowerState,
		{ uuid, index }: TowerUpgrade,
		{ user }: EntityMetadata & BroadcastMetadata,
	): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const towers = placed.get(uuid);
			if (towers === undefined) {
				return;
			}
			const tower = towers.get(`${index}`);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) {
				return;
			}
			tower.upgrades += 1;
		}),
});
