import { RarityId } from "../ids/rarity-id";
import { TowerId } from "../ids/tower-id";
import type { DamageKind } from "../kinds";

export interface TowerDefinition<I extends TowerId> {
	id: I;
	name: string;
	desc: string;

    damage: [number, number];
    range: [number, number];
    attackSpeed: [number, number];

    kind?: DamageKind;

    count: number;
    cost: number;

    rarity: RarityId;
    
}