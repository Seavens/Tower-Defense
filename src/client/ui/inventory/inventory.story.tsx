import { CreateReactStory } from "@rbxts/ui-labs";
import { Inventory } from "./inventory";
import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utils";
import { MAXIMUM_STORED } from "shared/inventory/constants";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

const items = ItemUtility.createItems(1, MAXIMUM_STORED, ItemKind.Tower);

export = CreateReactStory(
	{
		name: "Inventory",
		react: React,
		reactRoblox: ReactRoblox,
		cleanup: (): void => {
			store.resetState();
		},
	},
	(): Element => {
		store.inventoryAddItems({ items: items });
		return (
			<ReflexProvider producer={store}>
				<Inventory />
			</ReflexProvider>
		);
	},
);
