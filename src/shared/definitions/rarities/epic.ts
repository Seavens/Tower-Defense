import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityDefinition } from "shared/types/definitions/rarity-definition";
import { RarityId } from "shared/types/ids/rarity-id";

export const epicRarity: RarityDefinition<RarityId.Epic> = {
    id: RarityId.Epic,
    name: "Epic",
    desc: "An epic rarity.",
    weight: RARITY_WEIGHTS[RarityId.Epic],
    colorHex: "643B9F",
};
