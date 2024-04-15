// import { ItemId, type TowerItemId } from "shared/inventory/types";
// import { bluntTower } from "./blunt";
// import { eternalDamnationTower } from "./eternal-damnation";
// import { godTower } from "./god";
// import type { Mob } from "server/mob/class/class";
// import type { ReplicatedTower } from "shared/tower/types";

// export interface AbilityModule<I extends TowerItemId> {
// 	id: I;
// 	onAbility: (tower: ReplicatedTower, target: Mob) => void;
// }

// export const abilityModules: { [I in TowerItemId]?: AbilityModule<I> } = {
// 	[ItemId.God]: godTower,
// 	[ItemId.Blunt]: bluntTower,
// 	[ItemId.EternalDamnation]: eternalDamnationTower,
// };
