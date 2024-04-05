// import { Boolean, CreateReactStory } from "@rbxts/ui-labs";
// import { Inventory } from "./inventory";
// import { ItemKind } from "shared/inventory/types";
// import { ItemUtility } from "shared/inventory/utility";
// import { MAXIMUM_STORED } from "shared/inventory/constants";
// import { ReflexProvider } from "@rbxts/react-reflex";
// import { store } from "client/state/store";
// import React from "@rbxts/react";
// import ReactRoblox from "@rbxts/react-roblox";
// import type { Element } from "@rbxts/react";

// const items = ItemUtility.createItems(1, MAXIMUM_STORED);

// export = CreateReactStory(
// 	{
// 		name: "Inventory",
// 		react: React,
// 		reactRoblox: ReactRoblox,
// 		cleanup: (): void => {
// 			store.resetState();
// 		},
// 		controls: {
// 			visible: Boolean(true),
// 		},
// 	},
// 	({ controls }): Element => {
// 		const { visible } = controls;
// 		store.inventoryAddItems({ items: items });
// 		store.profileAdjustCoins({ coins: 5465653468 });
// 		store.profileAdjustGems({ gems: 8338 });
// 		return (
// 			<ReflexProvider producer={store}>
// 				<Inventory visible={visible} />
// 			</ReflexProvider>
// 		);
// 	},
// );
