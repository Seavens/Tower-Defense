import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityId } from "shared/types/ids/rarity-id";
import type { RarityDefinition } from "shared/types/definitions/rarity-definition";

export const epicRarity: RarityDefinition<RarityId.Epic> = {
	id: RarityId.Epic,
	name: "Epic",
	desc: "An epic rarity.",
	weight: RARITY_WEIGHTS[RarityId.Epic],
	color: [0.62, 0.1, 0.72],
};
