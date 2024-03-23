import { createProducer } from "@rbxts/reflex";

import { produce } from "@rbxts/immut";

import type { Draft } from "@rbxts/immut/src/types-external";

import type { PlacementActions, PlacementBegin, PlacementEnd } from "../actions";

export interface PlacementState {
	placing: Option<string>;
}

const placementState: PlacementState = {
	placing: undefined,
};

export const placementSlice = createProducer<PlacementState, PlacementActions<PlacementState>>(placementState, {
	beginPlacement: (state: PlacementState, { placing }: PlacementBegin): PlacementState =>
		produce(state, (draft: Draft<PlacementState>): void => {
			draft.placing = placing;
		}),

	endPlacement: (state: PlacementState, _: PlacementEnd): PlacementState =>
		produce(state, (draft: Draft<PlacementState>): void => {
			draft.placing = undefined;
		}),
});
