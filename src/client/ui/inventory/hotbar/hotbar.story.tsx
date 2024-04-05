import { CreateReactStory } from "@rbxts/ui-labs";
import { Hotbar } from ".";
import { ItemUtility } from "shared/inventory/utility";
import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";

export = CreateReactStory(
	{
		name: "Hotbar",
		react: React,
		reactRoblox: ReactRoblox,
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const items = new Map<Slot, Item>();
		const equipped = new Array<Slot>();
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot: Slot = `${index}`;
			if (index % 2 !== 0) {
				const item = ItemUtility.createItem(1);
				items.set(slot, item);
				warn(`Created item ${item.id} for slot ${slot}`);
			}
			warn(`Equipped slot ${slot}`);
			equipped.push(slot);
		}
		store.profileAddExperience({ amount: 168754 });
		store.profileAdjustCoins({ coins: 35178 });
		store.profileAdjustGems({ gems: 418 });

		return (
			<ReflexProvider producer={store}>
				<Hotbar visible={true} items={items} equipped={equipped} />
			</ReflexProvider>
		);
	},
);
