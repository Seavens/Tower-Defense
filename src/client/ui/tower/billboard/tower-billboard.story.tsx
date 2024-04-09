import { CreateReactStory } from "@rbxts/ui-labs";
import { ItemKind, type ItemTowerUnique } from "shared/inventory/types";
import { ReflexProvider } from "@rbxts/react-reflex";
import { TowerBillboard } from "./billboard";
import { godTowerItem } from "shared/inventory/items/towers/god";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Tower Billboard",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			damage: 100,
			range: 100,
			cooldown: 3,
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { damage, range, cooldown } = controls;
		const currentOwner = math.random(1, 1000000);

		const unique: ItemTowerUnique = {
			kind: ItemKind.Tower,
			damage: damage,
			range: range,
			cooldown: cooldown,
			owner: 1,
			level: 1,
			experience: 1,
			locked: true,
		} as const;

		return (
			<ReflexProvider producer={store}>
				{/* <TowerBillboard owner={currentOwner} unique={unique} /> */}
			</ReflexProvider>
		);
	},
);
