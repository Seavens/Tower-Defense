import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityId } from "shared/types/ids/rarity-id";
import type { RarityDefinition } from "shared/types/definitions/rarity-definition";

export const legendaryRarity: RarityDefinition<RarityId.Legendary> = {
	id: RarityId.Legendary,
	name: "Legendary",
	desc: "A legendary rarity.",
	weight: RARITY_WEIGHTS[RarityId.Legendary],
	color: [0.6, 0.67, 0.21],
};
