import { TowerId } from "shared/types/ids";
import { bluntTower } from "./blunt";
import { godTower } from "./god";
import { meleeTower } from "./melee";
import { sniperTower } from "./sniper";
import type { TowerDefinition } from "shared/types/definitions";

export type AnyTowerDefinition = (typeof TowerDefinitions)[TowerId];

export const TowerDefinitions: { [I in TowerId]: TowerDefinition<I> } = {
	[TowerId.Melee]: meleeTower,
	[TowerId.Sniper]: sniperTower,
	[TowerId.God]: godTower,
	[TowerId.Blunt]: bluntTower,
} as const;
