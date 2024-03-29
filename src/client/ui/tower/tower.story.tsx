import { CreateReactStory } from "@rbxts/ui-labs";

import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utils";
import { ReflexProvider } from "@rbxts/react-reflex";
import { Tower } from "./tower";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { Item, ItemTowerClass, TowerItemId } from "shared/inventory/types";

export = CreateReactStory(
	{
		name: "Tower",
		react: React,
		reactRoblox: ReactRoblox,
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const item = ItemUtility.createItem(1, ItemKind.Tower) as Item & { id: TowerItemId; unique: ItemTowerClass };

		return (
			<ReflexProvider producer={store}>
				<Tower {...item} onClick={warn} />
			</ReflexProvider>
		);
	},
);
