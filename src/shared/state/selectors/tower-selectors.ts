import { createSelector } from "@rbxts/reflex";
import type { ReplicatedTower } from "shared/types/objects";
import type { SharedState, TowerState } from "../slices";

export function selectTowerState(state: SharedState): TowerState {
	const { tower } = state;
	return tower;
}

export function selectPlacedTowers(state: SharedState): Map<string, ReplicatedTower> {
	const { placed } = selectTowerState(state);
	return placed;
}

export function selectSpecificTower(key: string): (state: SharedState) => Option<ReplicatedTower> {
	return function (state: SharedState): Option<ReplicatedTower> {
		const placed = selectPlacedTowers(state);
		return placed.get(key);
	};
}

export function selectTowersByOwner(owner: string): (state: SharedState) => Array<ReplicatedTower> {
	return createSelector(selectPlacedTowers, (placed: Map<string, ReplicatedTower>): Array<ReplicatedTower> => {
		const towers = new Array<ReplicatedTower>();
		for (const [key, tower] of placed) {
			if (tower.owner !== owner) {
				continue;
			}
			towers.push(tower);
		}
		return towers;
	});
}
