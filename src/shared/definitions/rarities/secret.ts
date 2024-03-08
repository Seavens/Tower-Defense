import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityDefinition } from "shared/types/definitions/rarity-definition";
import { RarityId } from "shared/types/ids/rarity-id";

export const secretRarity: RarityDefinition<RarityId.Secret> = {
    id: RarityId.Secret,
    name: "Secret",
    desc: "A secret rarity.",
    weight: RARITY_WEIGHTS[RarityId.Secret],
    colorHex: "EE4B2B",
};
