import { isTowerId } from "../ids";
import { t } from "@rbxts/t";
import type { Tower } from "./tower";

export const isTower = t.strictInterface({
	id: isTowerId,
	owner: t.number,
	original: t.number,

	damage: t.number,
	range: t.number,
	attackSpeed: t.number,

	uuid: t.string,
	timestamp: t.number,

	level: t.number,
	cost: t.number,
});

export type { Tower };
