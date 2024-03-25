import { TowerId } from "../types";
import { bluntTower } from "./blunt";
import { godTower } from "./god";
import { meleeTower } from "./melee";
import { sniperTower } from "./sniper";
import type { ItemRarity } from "shared/inventory/types";
import type { MobDamage } from "shared/mobs/types";
import type { TowerTargeting } from "../types";

export interface TowerDefinition<I extends TowerId> {
	id: I;
	name: string;
	desc: string;

	damage: [number, number];
	range: [number, number];
	cooldown: [number, number];

	kind: MobDamage;

	count: number;
	cost: number;

	rarity: ItemRarity;

	targeting: [
		TowerTargeting.First,
		TowerTargeting.Last,
		TowerTargeting.Strongest,
		TowerTargeting.Weakest,
		TowerTargeting.Farthest,
		TowerTargeting.Closest,
	];

	image: RBXAssetId;
}

export type AnyTowerDefintion = (typeof towerDefinitions)[TowerId];

export const towerDefinitions: { [I in TowerId]: TowerDefinition<I> } = {
	[TowerId.Sniper]: sniperTower,
	[TowerId.Melee]: meleeTower,
	[TowerId.God]: godTower,
	[TowerId.Blunt]: bluntTower,
} as const;
