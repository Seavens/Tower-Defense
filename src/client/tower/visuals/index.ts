import { TowerVisual } from "shared/tower/types";
import { sniperShotModule } from "./sniper-shot";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "shared/mob/api";

export interface TowerVisualModule<T extends TowerVisual> {
	id: T;
	duration: number;

	onEffect: (bin: Bin, model: Model, target: Option<Mob>) => void;
}

export const towerVisualModules: { [T in TowerVisual]: TowerVisualModule<T> } = {
	[TowerVisual.SniperShot]: sniperShotModule,
} as const;
