export type PlacementActions<S> = {
	beginPlacement: (state: S, payload: PlacementBegin) => S;

	endPlacement: (state: S, payload: PlacementEnd) => S;
};

export interface PlacementBegin {
	placing: string;
}

export interface PlacementEnd {}
