import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityId } from "shared/types/ids/rarity-id";
import type { RarityDefinition } from "shared/types/definitions/rarity-definition";

export const epicRarity: RarityDefinition<RarityId.Epic> = {
	id: RarityId.Epic,
	name: "Epic",
	desc: "An epic rarity.",
	weight: RARITY_WEIGHTS[RarityId.Epic],
	color: Color3.fromRGB(106, 13, 173),
};
