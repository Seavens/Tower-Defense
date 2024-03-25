import { ItemId } from "../types";
import { bluntTowerItem } from "./blunt";
import { chaliceRelicItem } from "./chalice";
import { godTowerItem } from "./god";
import { meleeTowerItem } from "./melee";
import { sniperTowerItem } from "./sniper";
import type { ItemClass } from "../types";
import type { ItemRarity } from "shared/inventory/types";
import type { MobDamage } from "shared/mobs/types";
import type { TowerTargeting } from "shared/tower/types";

interface TowerDefinition {
	class: ItemClass.Tower;

	damage: number;
	range: number;
	cooldown: number;

	kind: MobDamage;
	count: number;
	cost: number;

	targeting: [TowerTargeting, ...Array<TowerTargeting>];
}

interface RelicDefinition {
	class: ItemClass.Relic;

	placeholder: number;
}

export interface ItemClasses {
	[ItemClass.Tower]: TowerDefinition;
	[ItemClass.Relic]: RelicDefinition;
}

export interface ItemDefinition<I extends ItemId, C extends ItemClass> {
	id: I;
	name: string;
	desc: string;

	rarity: ItemRarity;
	image: RBXAssetId;

	class: ItemClasses[C];
}

type InferClass<T> = T extends ItemDefinition<ItemId, infer C> ? C : never;
export type AnyItemDefinition = (typeof itemDefinitions)[ItemId];

export type RelicItemIds = {
	[I in keyof typeof itemDefinitions]: (typeof itemDefinitions)[I] extends ItemDefinition<I, ItemClass.Relic>
		? I
		: never;
}[ItemId];
export type TowerItemIds = {
	[I in keyof typeof itemDefinitions]: (typeof itemDefinitions)[I] extends ItemDefinition<I, ItemClass.Tower>
		? I
		: never;
}[ItemId];

export const itemDefinitions = {
	[ItemId.Sniper]: sniperTowerItem,
	[ItemId.Melee]: meleeTowerItem,
	[ItemId.Blunt]: bluntTowerItem,
	[ItemId.God]: godTowerItem,
	[ItemId.Chalice]: chaliceRelicItem,
} as const;
itemDefinitions satisfies { [I in ItemId]: ItemDefinition<I, InferClass<(typeof itemDefinitions)[I]>> };
