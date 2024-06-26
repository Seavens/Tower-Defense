import { relics } from "./relics";
import { towers } from "./towers/definitions";
import type { ItemId, ItemKind, ItemRarity } from "shared/inventory/types";
import type { MobDamage } from "shared/mob/types";
import type { TowerAbility } from "./towers/abilities/types";
import type { TowerAnimation, TowerSounds, TowerTargeting, TowerVisual, TowerVisuals } from "shared/tower/types";

export type TowerUpgradeInfo = {
	upgrade: number;
	multiplier: {
		damage: number;
		range: number;
		cooldown: number;
		income?: number;
	};
	ability: boolean;
	cost: number;
};

interface TowerDefinition {
	kind: ItemKind.Tower;

	damage: number;
	range: number;
	cooldown: number;
	income?: number;

	damageKind: MobDamage;
	limit: number;
	cost: number;
	upgrades: Array<TowerUpgradeInfo>;
	targeting: [TowerTargeting, ...Array<TowerTargeting>];

	visuals: { [K in TowerVisuals]: TowerVisual };

	abilities?: [TowerAbility, ...Array<TowerAbility>];

	animations: { [K in TowerAnimation]: Array<RBXAssetId> };
	sounds: { [K in TowerSounds]: Array<RBXAssetId> };
}

interface RelicDefinition {
	kind: ItemKind.Relic;
	multiplier: number;
}

export interface DefinitionKinds {
	[ItemKind.Tower]: TowerDefinition;
	[ItemKind.Relic]: RelicDefinition;
}

export interface ItemDefinition<I extends ItemId, C extends ItemKind> {
	id: I;
	name: string;
	desc: string;

	rarity: ItemRarity;
	image: RBXAssetId;
	value: number;

	kind: DefinitionKinds[C];
}

type InferClass<T> = T extends ItemDefinition<ItemId, infer C> ? C : never;
export type AnyItemDefinition = (typeof itemDefinitions)[ItemId];
export type KindItemDefinition<K extends ItemKind> = {
	[I in keyof typeof itemDefinitions]: (typeof itemDefinitions)[I] extends ItemDefinition<I, K>
		? ItemDefinition<I, K>
		: never;
}[ItemId];

export const itemDefinitions = {
	...relics,
	...towers,
} as const;
itemDefinitions satisfies { [I in ItemId]: ItemDefinition<I, InferClass<(typeof itemDefinitions)[I]>> };
