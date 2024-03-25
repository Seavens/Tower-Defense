import { ItemRarity } from "../types";
import { epicRarity } from "./epic";
import { legendaryRarity } from "./legendary";
import { mythicalRarity } from "./mythical";
import { rareRarity } from "./rare";
import { secretRarity } from "./secret";

export interface RarityDefinition<I extends ItemRarity> {
	id: I;
	name: string;
	desc: string;

	weight: number;
	color: Color3;
}

export type AnyRarityDefinition = (typeof rarityDefinitions)[ItemRarity];

export const rarityDefinitions: { [I in ItemRarity]: RarityDefinition<I> } = {
	[ItemRarity.Rare]: rareRarity,
	[ItemRarity.Epic]: epicRarity,
	[ItemRarity.Legendary]: legendaryRarity,
	[ItemRarity.Mythical]: mythicalRarity,
	[ItemRarity.Secret]: secretRarity,
} as const;
