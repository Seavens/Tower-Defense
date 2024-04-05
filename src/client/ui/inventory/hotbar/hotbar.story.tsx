import { CreateReactStory } from "@rbxts/ui-labs";
import { Hotbar } from ".";
import { ItemUtility } from "shared/inventory/utility";
import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";
import { Players } from "@rbxts/services";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";

export = CreateReactStory(
	{
		name: "Hot Bar",
		react: React,
		reactRoblox: ReactRoblox,
	},
	({ controls }): Element => {
		const items = new Map<Slot, Item>();
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const item = ItemUtility.createItem(1);
			items.set(`${index}`, item);
		}

		store.profileAddExperience({ amount: 168754 });
		store.profileAdjustCoins({ coins: 35178 });
		store.profileAdjustGems({ gems: 418 });

		return (
			<ReflexProvider producer={store}>
				<Hotbar items={items} />
			</ReflexProvider>
		);
	},
);
