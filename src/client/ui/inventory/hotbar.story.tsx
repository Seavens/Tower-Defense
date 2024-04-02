import { CreateReactStory } from "@rbxts/ui-labs";
import { Hotbar } from "./hotbar";
import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utility";
import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

const items = ItemUtility.createItems(1, MAXIMUM_EQUIPPED, ItemKind.Tower);

export = CreateReactStory(
	{
		name: "Hotbar",
		react: React,
		reactRoblox: ReactRoblox,
		cleanup: (): void => {
			store.resetState();
		},
	},
	(): Element => {
		store.inventoryAddItems({ items: items });
		store.profileAddExperience({ amount: 10000000 });
		task.defer((): void => {
			for (const index of $range(1, MAXIMUM_EQUIPPED)) {
				const slot: Slot = `${index}`;
				store.inventoryEquipSlot({ slot });
			}
		});
		return (
			<ReflexProvider producer={store}>
				<Hotbar />
			</ReflexProvider>
		);
	},
);
