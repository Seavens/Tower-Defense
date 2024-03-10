import { CreateStory } from ".";
import { ItemSlot } from "../components";
import { TowerId } from "shared/types/ids";
import type { Element } from "@rbxts/roact";
import type { FlipbookStory } from ".";
import type { Tower } from "shared/types/objects";

const towerData: Tower = {
	level: 10,
	id: TowerId.God,
	owner: 1,
	original: 1,
	damage: 1,
	range: 1,
	attackSpeed: 1,
	uuid: "1",
	timestamp: 1,
};

const ItemSlotStory: FlipbookStory = {
	summary: "Item Slot",
	controls: undefined,
	story: (props: {}): Element => {
		return ItemSlot({ towerData: towerData });
	},
};

export = CreateStory(ItemSlotStory);
