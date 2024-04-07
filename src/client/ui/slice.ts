import { createProducer } from "@rbxts/reflex";
import type { UIActions, UIClose, UIOpen } from "./actions";
import { UI_PRIORITIES } from "./constants";
import type { UIKind } from "./types";

export interface UIState {
	readonly open: Option<UIKind>;
}

const uiState: UIState = {
	open: undefined,
};

export const uiSlice = createProducer<UIState, UIActions<UIState>>(uiState, {
	openUI: (state: UIState, { kind, force = false }: UIOpen): UIState => {
		const { open } = state;
		if (open === undefined) {
			return {
				open: kind,
			};
		}
		const current = UI_PRIORITIES[open];
		const priority = UI_PRIORITIES[kind];
		if (current > priority && !force) {
			return state;
		}
		return {
			open: kind,
		};
	},
	closeUI: (state: UIState, { kind, force = false }: UIClose): UIState => {
		const { open } = state;
		if (open !== kind && !force) {
			return state;
		}
		return {
			open: undefined,
		};
	},
});
