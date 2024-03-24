import { DamageKind } from "shared/types/kinds";
import { RarityId } from "shared/types/ids/rarity-id";
import { TargetId } from "shared/types/ids";
import { TowerId } from "shared/types/ids/tower-id";
import type { TowerDefinition } from "shared/types/definitions/tower-definition";

export const bluntTower: TowerDefinition<TowerId.Blunt> = {
	id: TowerId.Blunt,
	name: "Blunt Tower",
	desc: "A Blunt tower that attacks enemies as a groups.",
	damage: [32, 42],
	range: [15, 19],
	cooldown: [4, 7],
	kind: DamageKind.Blunt,
	count: 3,
	cost: 500,
	rarity: RarityId.Epic,
	image: `rbxassetid://16672016840`,
	targeting: [
		TargetId.First,
		TargetId.Last,
		TargetId.Strongest,
		TargetId.Weakest,
		TargetId.Farthest,
		TargetId.Closest,
	],
};
