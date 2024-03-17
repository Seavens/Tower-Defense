import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityId } from "shared/types/ids/rarity-id";
import type { RarityDefinition } from "shared/types/definitions/rarity-definition";

export const rareRarity: RarityDefinition<RarityId.Rare> = {
	id: RarityId.Rare,
	name: "Rare",
	desc: "A rare rarity.",
	weight: RARITY_WEIGHTS[RarityId.Rare],
	color: Color3.fromRGB(152, 193, 217),
};
