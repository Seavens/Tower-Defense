import { CreateReactStory } from "@rbxts/ui-labs";
import { Inventory } from ".";
import { ItemUtility } from "shared/inventory/utility";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";

export = CreateReactStory(
	{
		name: "Inventory",
		react: React,
		reactRoblox: ReactRoblox,
	},
	({ controls }): Element => {
		const items = new Map<Slot, Item>();
		for (const index of $range(1, 100)) {
			const item = ItemUtility.createItem(1);
			items.set(`${index}`, item);
		}

		return (
			<ReflexProvider producer={store}>
				<Inventory items={items} visible={true} />
			</ReflexProvider>
		);
	},
);
