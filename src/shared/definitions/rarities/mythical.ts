import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityId } from "shared/types/ids/rarity-id";
import type { RarityDefinition } from "shared/types/definitions/rarity-definition";

export const mythicalRarity: RarityDefinition<RarityId.Mythical> = {
	id: RarityId.Mythical,
	name: "Mythical",
	desc: "A mythical rarity.",
	weight: RARITY_WEIGHTS[RarityId.Mythical],
	color: [0.72, 0.2, 0.2],
};
