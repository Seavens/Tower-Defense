import { RarityId } from "shared/types/ids/rarity-id";
import { TowerId } from "shared/types/ids/tower-id";
import type { TowerDefinition } from "shared/types/definitions/tower-definition";

export const meleeTower: TowerDefinition<TowerId.Melee> = {
	id: TowerId.Melee,
	name: "Melee Tower",
	desc: "A melee tower that attacks nearby enemies.",
	damage: [5, 8],
	range: [7, 10],
	attackSpeed: [0.2, 0.6],
	kind: undefined,
	count: 5,
	cost: 100,
	rarity: RarityId.Rare,
	imageId: 178007979,
};
