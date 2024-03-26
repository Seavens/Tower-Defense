import { type ClientState, store } from "client/state/store";
import { CreateReactStory } from "@rbxts/ui-labs";
import { Hotbar } from "./hotbar";
import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utils";
import { ReflexProvider } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

const items = ItemUtility.createItems(1, 6, ItemKind.Tower);

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
		store.inventoryEquipItems({ items: items });
		return (
			<ReflexProvider producer={store}>
				<Hotbar />
			</ReflexProvider>
		);
	},
);
