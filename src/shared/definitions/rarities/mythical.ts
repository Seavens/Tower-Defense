import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityDefinition } from "shared/types/definitions/rarity-definition";
import { RarityId } from "shared/types/ids/rarity-id";

export const mythicalRarity: RarityDefinition<RarityId.Mythical> = {
    id: RarityId.Mythical,
    name: "Mythical",
    desc: "A mythical rarity.",
    weight: RARITY_WEIGHTS[RarityId.Mythical],
    colorHex: "000000",
};
