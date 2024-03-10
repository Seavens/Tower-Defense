import { RarityId } from "shared/types/ids/rarity-id";
import { TowerId } from "shared/types/ids/tower-id";
import type { TowerDefinition } from "shared/types/definitions/tower-definition";

export const bluntTower: TowerDefinition<TowerId.Blunt> = {
	id: TowerId.Blunt,
	name: "Blunt Tower",
	desc: "A Blunt tower that attacks enemies as a groups.",
	damage: [70, 80],
	range: [10, 20],
	attackSpeed: [3, 4],
	kind: undefined,
	count: 3,
	cost: 500,
	rarity: RarityId.Epic,
	imageId: 16672016840,
};
