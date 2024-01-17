import type { CombineStates } from "@rbxts/reflex";

export type SharedProducers = typeof sharedSlices;
export type SharedState = CombineStates<SharedProducers>;

export const sharedSlices = {};
