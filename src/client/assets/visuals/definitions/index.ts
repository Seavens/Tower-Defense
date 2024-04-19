import { TowerVisual } from "shared/tower/types";
import { buffVisual } from "./buff";
import { edSummonVisual } from "./ed-summon";
import { heatedImpactVisual } from "./heated-impact";
import { holyStrikeVisual } from "./holy-strike";
import { neutronVisual } from "./neutron";
import { sniperShotVisual } from "./sniper-shot";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "client/mob/class";
import type { ReplicatedTower } from "shared/tower/types";

export interface TowerVisualModule<T extends TowerVisual> {
	id: T;
	duration: number;

	onEffect: (bin: Bin, model: Model, target: Option<Mob>, tower: ReplicatedTower) => void;
}

export const towerVisualModules: { [T in TowerVisual]: TowerVisualModule<T> } = {
	[TowerVisual.SniperShot]: sniperShotVisual,
	[TowerVisual.HolyStrike]: holyStrikeVisual,
	[TowerVisual.HeatedImpact]: heatedImpactVisual,
	[TowerVisual.Neutron]: neutronVisual,
	[TowerVisual.EDSummon]: edSummonVisual,
	[TowerVisual.Buff]: buffVisual,
} as const;
