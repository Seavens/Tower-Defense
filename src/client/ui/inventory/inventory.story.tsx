import { Boolean, CreateReactStory } from "@rbxts/ui-labs";
import { Inventory } from "./inventory";
import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utils";
import { MAXIMUM_STORED } from "shared/inventory/constants";
import { Players } from "@rbxts/services";
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
		controls: {
			visible: Boolean(true),
		},
	},
	({ controls }): Element => {
		const { visible } = controls;
		store.inventoryAddItems({ items: items });
		store.profileAdjustCoins({ isAdd: true, coins: 5465653468 });
		store.profileAdjustGems({ isAdd: true, gems: 8338 });
		return (
			<ReflexProvider producer={store}>
				<Inventory visible={visible} />
			</ReflexProvider>
		);
	},
);
