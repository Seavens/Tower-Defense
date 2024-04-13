import { TowerVisual } from "shared/tower/types";
import { holyStrikeVisual } from "./holy-strike";
import { sniperShotVisual } from "./sniper-shot";
import { towerPlaceVisual } from "./tower-place";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "client/mob/class/class";

export interface TowerVisualModule<T extends TowerVisual> {
	id: T;
	duration: number;

	onEffect: (bin: Bin, model: Model, target?: Option<Mob>) => void;
}

export const towerVisualModules: { [T in TowerVisual]: TowerVisualModule<T> } = {
	[TowerVisual.SniperShot]: sniperShotVisual,
	[TowerVisual.HolyStrike]: holyStrikeVisual,
	[TowerVisual.TowerPlace]: towerPlaceVisual,
} as const;
