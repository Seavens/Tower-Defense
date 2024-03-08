import { RarityId } from "shared/types/ids/rarity-id";
import { RarityDefinition } from "shared/types/definitions/rarity-definition";
import { rareRarity } from "./rare";
import { epicRarity } from "./epic";
import { legendaryRarity } from "./legendary";
import { mythicalRarity } from "./mythical";
import { secretRarity } from "./secret";

export const rarityDefinitions: { [I in RarityId]: RarityDefinition<I> } = {
    [RarityId.Rare]: rareRarity,
    [RarityId.Epic]: epicRarity,
    [RarityId.Legendary]: legendaryRarity,
    [RarityId.Mythical]: mythicalRarity,
    [RarityId.Secret]: secretRarity,

} as const;