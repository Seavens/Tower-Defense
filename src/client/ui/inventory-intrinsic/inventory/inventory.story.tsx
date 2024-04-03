import { CreateReactStory } from "@rbxts/ui-labs";
import { Inventory } from ".";
import { ItemUtility } from "shared/inventory/utility";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";

export = CreateReactStory(
	{
		name: "Inventory Slot v2",
		react: React,
		reactRoblox: ReactRoblox,
	},
	({ controls }): Element => {
		const items = new Map<Slot, Item>();
		for (const index of $range(1, 100)) {
			const item = ItemUtility.createItem(1);
			items.set(`${index}`, item);
		}

		return <Inventory items={items} />;
	},
);
