import { isTowerId } from "../ids";
import { t } from "@rbxts/t";
import type { TowerObject } from "./tower";

export const isTowerObject = t.strictInterface({
	id: isTowerId,
	owner: t.number,
	original: t.number,

	damage: t.number,
	range: t.number,
	cooldown: t.number,

	uuid: t.string,
	timestamp: t.string,

	level: t.number,
	cost: t.number,

	locked: t.boolean,
});

export type { TowerObject };
