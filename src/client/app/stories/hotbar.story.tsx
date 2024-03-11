import { Hotbar } from "../components";
import { TowerId } from "shared/types/ids";
import type { Element } from "@rbxts/react";
import type { InventoryData } from "shared/types/data";
import type { Tower } from "shared/types/objects";

const tower1: Tower = {
	level: 100,
	id: TowerId.God,
	owner: 1,
	original: 1,
	damage: 1,
	range: 1,
	attackSpeed: 1,
	uuid: "1",
	timestamp: 1,
};

const tower2: Tower = {
	level: 100,
	id: TowerId.Blunt,
	owner: 1,
	original: 1,
	damage: 1,
	range: 1,
	attackSpeed: 1,
	uuid: "1",
	timestamp: 1,
};

const tower3: Tower = {
	level: 100,
	id: TowerId.Sniper,
	owner: 1,
	original: 1,
	damage: 1,
	range: 1,
	attackSpeed: 1,
	uuid: "1",
	timestamp: 1,
};

const tower4: Tower = {
	level: 100,
	id: TowerId.Melee,
	owner: 1,
	original: 1,
	damage: 1,
	range: 1,
	attackSpeed: 1,
	uuid: "1",
	timestamp: 1,
};

const profileData = {
	level: 100,
	experience: 500000,
	coins: 0,
};

const inventoryData: InventoryData = {
	stored: new Map<string, Tower>([
		["1", tower1],
		["2", tower2],
		["3", tower3],
		["4", tower4],
	]),
	equipped: [tower1, tower2, tower3, tower4],
};
