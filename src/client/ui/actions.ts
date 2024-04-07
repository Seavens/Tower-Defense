import type { UIKind } from "./types";

export type UIActions<S> = {
	openUI: (state: S, payload: UIOpen) => S;
	closeUI: (state: S, payload: UIClose) => S;
};

export interface UIOpen {
	kind: UIKind;
	force?: boolean;
}

export interface UIClose {
	kind: UIKind;
	force?: boolean;
}
