import { TowerDefinition } from "shared/types/definitions/tower-definition";
import { RarityId } from "shared/types/ids/rarity-id";
import { TowerId } from "shared/types/ids/tower-id";

 export const godTower: TowerDefinition<TowerId.God> = {
      id: TowerId.God,
      name: "God Tower",
      desc: "A God tower that attacks enemies from anywhere.",
      damage: [70, 100],
      range: [30, 50],
      attackSpeed: [.1, .5],
      kind: undefined,
      count: 1,
      cost: 1000,
      rarity: RarityId.Mythical,
 }