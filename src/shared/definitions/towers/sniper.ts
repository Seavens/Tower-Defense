import { TowerDefinition } from "shared/types/definitions/tower-definition";
import { RarityId } from "shared/types/ids/rarity-id";
import { TowerId } from "shared/types/ids/tower-id";

 export const sniperTower: TowerDefinition<TowerId.Sniper> = {
      id: TowerId.Sniper,
      name: "Sniper Tower",
      desc: "A sniper tower that attacks enemies from a distance.",
      damage: [40, 50],
      range: [20, 30],
      attackSpeed: [1, 2],
      kind: undefined,
      count: 3,
      cost: 500,
      rarity: RarityId.Legendary,
 }