import type { DamageKind } from "../kinds";
import type { RarityId } from "../ids/rarity-id";
import type { TargetId } from "../ids";
import type { TowerId } from "../ids/tower-id";

export interface TowerDefinition<I extends TowerId> {
	id: I;
	name: string;
	desc: string;

	damage: [number, number];
	range: [number, number];
	cooldown: [number, number];

	kind: DamageKind;

	count: number;
	cost: number;

	rarity: RarityId;

	targeting: [
		TargetId.First,
		TargetId.Last,
		TargetId.Strongest,
		TargetId.Weakest,
		TargetId.Furthest,
		TargetId.Closest,
	];

	image: RBXAssetId;
}
