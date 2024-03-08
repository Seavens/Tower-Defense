import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityDefinition } from "shared/types/definitions/rarity-definition";
import { RarityId } from "shared/types/ids/rarity-id";

export const rareRarity: RarityDefinition<RarityId.Rare> = {
    id: RarityId.Rare,
    name: "Rare",
    desc: "A rare rarity.",
    weight: RARITY_WEIGHTS[RarityId.Rare],
    colorHex: "0047AB",
};