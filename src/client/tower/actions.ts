export type TowerUIActions<S> = {
	selectTower: (state: S, payload: TowerUISelect) => S;
	deselectTower: (state: S, payload: TowerUIDeselect) => S;
};

export interface TowerUISelect {
	key: string;
}

export interface TowerUIDeselect {}
