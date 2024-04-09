import { ItemId, type TowerItemId } from "shared/inventory/types";
import { bluntTower } from "./blunt";
import { eternalDamnationTower } from "./eternal-damnation";
import { godTower } from "./god";
import type { Mob } from "server/mob/class";
import type { ReplicatedTower } from "shared/tower/types";

export interface TowerModule<I extends TowerItemId> {
	id: I;

	onAttack: (tower: ReplicatedTower, target: Mob) => void;
}

export const towerModules: { [I in TowerItemId]?: TowerModule<I> } = {
	[ItemId.God]: godTower,
	[ItemId.Blunt]: bluntTower,
	[ItemId.EternalDamnation]: eternalDamnationTower,
};
