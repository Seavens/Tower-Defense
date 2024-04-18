import { ItemId, type TowerItemId } from "shared/inventory/types";
import { farmerTower } from "./farmer";
import { supporterTower } from "./supporter";
import type { Mob } from "server/mob/class";
import type { Tower } from "server/tower/class";

export interface TowerModule<I extends TowerItemId> {
	id: I;

	onAttack: (tower: Tower, target?: Mob) => void;
}

export const towerModules: { [I in TowerItemId]?: TowerModule<I> } = {
	[ItemId.Supporter]: supporterTower,
	[ItemId.Farmer]: farmerTower,
} as const;
