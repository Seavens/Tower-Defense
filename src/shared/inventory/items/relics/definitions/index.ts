import { ItemId } from "shared/inventory/types";
import { chaliceItem } from "./chalice";
import { rpgItem } from "./rpg";

export const relics = {
	[ItemId.Chalice]: chaliceItem,
	[ItemId.RPG]: rpgItem,
} as const;
