import { TowerId } from "shared/types/ids";
import { meleeTower } from "./melee";
import { sniperTower } from "./sniper";
import { TowerDefinition } from "shared/types/definitions";
import { godTower } from "./god";
import { bluntTower } from "./blunt";

export const TowerDefinitions: { [I in TowerId]: TowerDefinition<I>; } = {
    [TowerId.Melee]: meleeTower,
    [TowerId.Sniper]: sniperTower,
    [TowerId.God]: godTower,
    [TowerId.Blunt]: bluntTower,
} as const;