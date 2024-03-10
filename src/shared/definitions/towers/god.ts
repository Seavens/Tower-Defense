import { RarityId } from "shared/types/ids/rarity-id";
import { TowerId } from "shared/types/ids/tower-id";
import type { TowerDefinition } from "shared/types/definitions/tower-definition";

export const godTower: TowerDefinition<TowerId.God> = {
	id: TowerId.God,
	name: "God Tower",
	desc: "A God tower that attacks enemies from anywhere.",
	damage: [70, 100],
	range: [30, 50],
	attackSpeed: [0.1, 0.5],
	kind: undefined,
	count: 1,
	cost: 1000,
	rarity: RarityId.Mythical,
	imageId: 16172534401,
};
