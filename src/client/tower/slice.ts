import { createProducer } from "@rbxts/reflex";
import type { TowerUIActions, TowerUIDeselect, TowerUISelect } from "./actions";

export interface TowerUIState {
	readonly key: Option<string>;
}

const towerUIState: TowerUIState = {
	key: undefined,
};

export const towerUISlice = createProducer<TowerUIState, TowerUIActions<TowerUIState>>(towerUIState, {
	selectTower: (_: TowerUIState, { key }: TowerUISelect): TowerUIState => {
		// It's overkill to use immut for this.
		return {
			key,
		};
	},
	deselectTower: (_1: TowerUIState, _2: TowerUIDeselect): TowerUIState => {
		return {
			key: undefined,
		};
	},
});
