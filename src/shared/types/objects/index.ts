import { t } from "@rbxts/t";
import type { Item } from "./item";
import type { Tower } from "./tower";

export const isItem = t.strictInterface({});
export const isTower = t.strictInterface({});

export type { Item, Tower };
