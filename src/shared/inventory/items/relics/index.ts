import { ItemId } from "shared/inventory/types";
import { chaliceItem } from "./chalice";

export const relics = {
	[ItemId.Chalice]: chaliceItem,
} as const;
