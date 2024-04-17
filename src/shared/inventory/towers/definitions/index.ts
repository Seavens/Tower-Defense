import { ItemId } from "shared/inventory/types";
import { bluntTowerItem } from "./blunt";
import { eternalDamnationTowerItem } from "./eternal-damnation";
import { farmerTowerItem } from "./farmer";
import { godTowerItem } from "./god";
import { meleeTowerItem } from "./melee";
import { sniperTowerItem } from "./sniper";
import { supporterTowerItem } from "./supporter";

export const towers = {
	[ItemId.Sniper]: sniperTowerItem,
	[ItemId.Blunt]: bluntTowerItem,
	[ItemId.EternalDamnation]: eternalDamnationTowerItem,
	[ItemId.God]: godTowerItem,
	[ItemId.Melee]: meleeTowerItem,
	[ItemId.Farmer]: farmerTowerItem,
	[ItemId.Supporter]: supporterTowerItem,
} as const;
