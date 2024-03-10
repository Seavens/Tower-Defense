import { RarityId } from "shared/types/ids/rarity-id";
import { epicRarity } from "./epic";
import { legendaryRarity } from "./legendary";
import { mythicalRarity } from "./mythical";
import { rareRarity } from "./rare";
import { secretRarity } from "./secret";
import type { RarityDefinition } from "shared/types/definitions/rarity-definition";

export const rarityDefinitions: { [I in RarityId]: RarityDefinition<I> } = {
	[RarityId.Rare]: rareRarity,
	[RarityId.Epic]: epicRarity,
	[RarityId.Legendary]: legendaryRarity,
	[RarityId.Mythical]: mythicalRarity,
	[RarityId.Secret]: secretRarity,
} as const;
