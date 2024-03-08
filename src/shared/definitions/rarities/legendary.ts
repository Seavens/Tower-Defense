import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityDefinition } from "shared/types/definitions/rarity-definition";
import { RarityId } from "shared/types/ids/rarity-id";

export const legendaryRarity: RarityDefinition<RarityId.Legendary> = {
    id: RarityId.Legendary,
    name: "Legendary",
    desc: "A legendary rarity.",
    weight: RARITY_WEIGHTS[RarityId.Legendary],
    colorHex: "FFD700",
};
