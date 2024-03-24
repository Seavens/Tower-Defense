import { RarityId } from "shared/types/ids/rarity-id";
import { TargetId } from "shared/types/ids";
import { TowerId } from "shared/types/ids/tower-id";
import type { TowerDefinition } from "shared/types/definitions/tower-definition";

export const meleeTower: TowerDefinition<TowerId.Melee> = {
	id: TowerId.Melee,
	name: "Melee Tower",
	desc: "A melee tower that attacks nearby enemies.",
	damage: [24, 34],
	range: [18, 22],
	cooldown: [3, 5],
	kind: undefined,
	count: 5,
	cost: 100,
	rarity: RarityId.Rare,
	image: `rbxassetid://178007979`,
	targeting: [TargetId.First],
};
