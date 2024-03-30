import { ItemId } from "../types";
import { bluntTowerItem } from "./blunt";
import { chaliceRelicItem } from "./chalice";
import { eternalDamnationTowerItem } from "./enternal-damnation";
import { godTowerItem } from "./god";
import { meleeTowerItem } from "./melee";
import { sniperTowerItem } from "./sniper";
import type { ItemKind } from "../types";
import type { ItemRarity } from "shared/inventory/types";
import type { MobDamage } from "shared/mobs/types";
import type { TowerTargeting } from "shared/tower/types";

export type TowerUpgradeInfo = [
	upgrade: number,
	multiplier: [damage: number, range: number, cooldown: number],
	cost: number,
];

interface TowerDefinition {
	kind: ItemKind.Tower;

	damage: number;
	range: number;
	cooldown: number;

	damageKind: MobDamage;
	count: number;
	cost: number;

	upgrades: Array<TowerUpgradeInfo>;

	targeting: [TowerTargeting, ...Array<TowerTargeting>];
}

interface RelicDefinition {
	kind: ItemKind.Relic;
	multiplier: number;
}

export interface ItemClasses {
	[ItemKind.Tower]: TowerDefinition;
	[ItemKind.Relic]: RelicDefinition;
}

export interface ItemDefinition<I extends ItemId, C extends ItemKind> {
	id: I;
	name: string;
	desc: string;

	rarity: ItemRarity;
	image: RBXAssetId;

	kind: ItemClasses[C];
}

type InferClass<T> = T extends ItemDefinition<ItemId, infer C> ? C : never;
export type AnyItemDefinition = (typeof itemDefinitions)[ItemId];
export type KindItemDefinition<K extends ItemKind> = {
	[I in keyof typeof itemDefinitions]: (typeof itemDefinitions)[I] extends ItemDefinition<I, K>
		? ItemDefinition<I, K>
		: never;
}[ItemId];

export const itemDefinitions = {
	[ItemId.Sniper]: sniperTowerItem,
	[ItemId.Melee]: meleeTowerItem,
	[ItemId.Blunt]: bluntTowerItem,
	[ItemId.God]: godTowerItem,
	[ItemId.EternalDamnation]: eternalDamnationTowerItem,
	[ItemId.Chalice]: chaliceRelicItem,
} as const;
itemDefinitions satisfies { [I in ItemId]: ItemDefinition<I, InferClass<(typeof itemDefinitions)[I]>> };
