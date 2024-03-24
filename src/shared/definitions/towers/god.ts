import { DamageKind } from "shared/types/kinds";
import { RarityId } from "shared/types/ids/rarity-id";
import { TargetId } from "shared/types/ids";
import { TowerId } from "shared/types/ids/tower-id";
import type { TowerDefinition } from "shared/types/definitions/tower-definition";

export const godTower: TowerDefinition<TowerId.God> = {
	id: TowerId.God,
	name: "God Tower",
	desc: "A God tower that attacks enemies from anywhere.",
	damage: [84, 94],
	range: [30, 50],
	cooldown: [4, 7],
	kind: DamageKind.Magic,
	count: 1,
	cost: 700,
	rarity: RarityId.Mythical,
	image: `rbxassetid://16172534401`,
	targeting: [
		TargetId.First,
		TargetId.Last,
		TargetId.Strongest,
		TargetId.Weakest,
		TargetId.Farthest,
		TargetId.Closest,
	],
};
