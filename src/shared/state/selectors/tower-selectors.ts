import type { ReplicatedTower } from "shared/types/objects";
import type { SharedState, TowerState } from "../slices";

export function selectTowerState(state: SharedState): TowerState {
	const { tower } = state;
	return tower;
}

export function selectPlacedTowers(state: SharedState): Map<string, Map<string, ReplicatedTower>> {
	const { placed } = selectTowerState(state);
	return placed;
}

export function selectTowersOfUUID(uuid: string): (state: SharedState) => Map<string, ReplicatedTower> {
	return function (state: SharedState): Map<string, ReplicatedTower> {
		const placed = selectPlacedTowers(state);
		const towers = placed.get(uuid);
		return towers ?? new Map<string, ReplicatedTower>();
		// We shouldn't have to worry about that ??, it should never be undefined.
	};
}
