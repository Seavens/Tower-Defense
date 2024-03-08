import { TowerId } from "../ids";

export interface Tower {
    id: TowerId;
    owner: number;
    original: number;
    
    damage: number;
    range: number;
    attackSpeed: number;

    uuid: string;
    timestamp: number;

    // rank?: number;
}