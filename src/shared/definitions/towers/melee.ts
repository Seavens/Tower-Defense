import { TowerDefinition } from "shared/types/definitions/tower-definition";
import { RarityId } from "shared/types/ids/rarity-id";
import { TowerId } from "shared/types/ids/tower-id";

 export const meleeTower: TowerDefinition<TowerId.Melee> = {
    id: TowerId.Melee,
    name: "Melee Tower",
    desc: "A melee tower that attacks nearby enemies.",
    damage: [5, 8],
    range: [7, 10],
    attackSpeed: [.2, .6],
    kind: undefined,
    count: 5,
    cost: 100,

    rarity: RarityId.Rare,
 }