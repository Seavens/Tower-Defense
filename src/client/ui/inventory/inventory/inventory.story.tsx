import { CreateReactStory } from "@rbxts/ui-labs";
import { Inventory } from ".";
import { ItemUtility } from "shared/inventory/utility";
import { MAXIMUM_STORED } from "shared/inventory/constants";
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
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const items = new Map<Slot, Item>();
		const equipped = new Array<Slot>();
		for (const index of $range(1, MAXIMUM_STORED)) {
			const item = ItemUtility.createItem(1);
			items.set(`${index}`, item);
		}

		return (
			<ReflexProvider producer={store}>
				<Inventory items={items} equipped={equipped} visible={true} />
			</ReflexProvider>
		);
	},
);
