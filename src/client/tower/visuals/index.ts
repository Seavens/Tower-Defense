import { TowerVisual } from "shared/tower/types";
import { holyStrikeVisual } from "./holy-strike";
import { sniperShotModule } from "./sniper-shot";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "client/mob/class";

export interface TowerVisualModule<T extends TowerVisual> {
	id: T;
	duration: number;

	onEffect: (bin: Bin, model: Model, target: Option<Mob>) => void;
}

export const towerVisualModules: { [T in TowerVisual]: TowerVisualModule<T> } = {
	[TowerVisual.SniperShot]: sniperShotModule,
	[TowerVisual.HolyStrike]: holyStrikeVisual,
} as const;
