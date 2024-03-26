import { ItemId } from "../types";
import { bluntTowerItem } from "./blunt";
import { chaliceRelicItem } from "./chalice";
import { godTowerItem } from "./god";
import { meleeTowerItem } from "./melee";
import { sniperTowerItem } from "./sniper";
import type { ItemKind } from "../types";
import type { ItemRarity } from "shared/inventory/types";
import type { MobDamage } from "shared/mobs/types";
import type { TowerTargeting } from "shared/tower/types";

interface TowerDefinition {
	kind: ItemKind.Tower;

	damage: number;
	range: number;
	cooldown: number;

	damageKind: MobDamage;
	count: number;
	cost: number;

	targeting: [TowerTargeting, ...Array<TowerTargeting>];
}

interface RelicDefinition {
	kind: ItemKind.Relic;

	placeholder: number;
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

export const itemDefinitions = {
	[ItemId.Sniper]: sniperTowerItem,
	[ItemId.Melee]: meleeTowerItem,
	[ItemId.Blunt]: bluntTowerItem,
	[ItemId.God]: godTowerItem,
	[ItemId.Chalice]: chaliceRelicItem,
} as const;
itemDefinitions satisfies { [I in ItemId]: ItemDefinition<I, InferClass<(typeof itemDefinitions)[I]>> };
