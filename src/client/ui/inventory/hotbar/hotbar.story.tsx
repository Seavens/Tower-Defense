import { CreateReactStory, Number } from "@rbxts/ui-labs";
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
		name: "Hotbar",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			experience: Number(0, 0, math.huge, 1),
			coins: Number(0, 0, math.huge, 1),
			gems: Number(0, 0, math.huge, 1),
			currency: Number(0, 0, math.huge, 1),
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { experience, coins, gems, currency } = controls;
		const items = new Map<Slot, Item>();
		const equipped = new Array<Slot>();
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot: Slot = `${index}`;
			if (index % 2 !== 0) {
				const item = ItemUtility.createItem(undefined, 1);
				items.set(slot, item);
			}
			equipped.push(slot);
		}

		const player = Players.LocalPlayer.Name;
		store.resetState();

		store.profileAddExperience({ amount: experience });
		store.profileAdjustCoins({ coins: coins });
		store.profileAdjustGems({ gems: gems });
		store.gameAddCurrency({ amount: currency }, { user: player, broadcast: true });

		return (
			<ReflexProvider producer={store}>
				<Hotbar visible={true} items={items} equipped={equipped} />
			</ReflexProvider>
		);
	},
);
