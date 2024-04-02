import { ItemId } from "shared/inventory/types";
import { bluntTowerItem } from "./blunt";
import { eternalDamnationTowerItem } from "./eternal-damnation";
import { godTowerItem } from "./god";
import { meleeTowerItem } from "./melee";
import { sniperTowerItem } from "./sniper";

export const towers = {
	[ItemId.Sniper]: sniperTowerItem,
	[ItemId.Blunt]: bluntTowerItem,
	[ItemId.EternalDamnation]: eternalDamnationTowerItem,
	[ItemId.God]: godTowerItem,
	[ItemId.Melee]: meleeTowerItem,
} as const;
