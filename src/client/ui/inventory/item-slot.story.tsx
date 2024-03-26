import { CreateReactStory } from "@rbxts/ui-labs";
import { ItemKind } from "shared/inventory/types";
import { ItemSlot } from "./item-slot";
import { ItemUtility } from "shared/inventory/utils";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

const item = ItemUtility.createItem(1, ItemKind.Tower);

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
		return (
			<ReflexProvider producer={store}>
				<ItemSlot {...item} />
			</ReflexProvider>
		);
	},
);
