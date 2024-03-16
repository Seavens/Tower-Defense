import { RARITY_WEIGHTS } from "shared/constants/rarity-constants";
import { RarityId } from "shared/types/ids/rarity-id";
import type { RarityDefinition } from "shared/types/definitions/rarity-definition";

export const secretRarity: RarityDefinition<RarityId.Secret> = {
	id: RarityId.Secret,
	name: "Secret",
	desc: "A secret rarity.",
	weight: RARITY_WEIGHTS[RarityId.Secret],
	colorRGB: [0, 0, 0],
};
