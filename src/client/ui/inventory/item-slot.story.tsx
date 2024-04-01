import { Boolean, Choose, CreateReactStory } from "@rbxts/ui-labs";
import { ItemKind, type ItemTowerUnique, type TowerItemId } from "shared/inventory/types";
import { ItemSlot } from "./item-slot";
import { Modding } from "@flamework/core";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

const allTowerItemIds = Modding.inspect<Array<TowerItemId>>();

const unique: ItemTowerUnique = {
	cooldown: 1.15,
	damage: 1.15,
	kind: ItemKind.Tower,
	level: 1,
	experience: 15,
	locked: false,
	owner: 1,
	range: 1.15,
};

export = CreateReactStory(
	{
		name: "Hotbar",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			id: Choose(allTowerItemIds),
			affordable: Boolean(true),
			selected: Boolean(true),
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { id, affordable, selected } = controls;

		return (
			<ReflexProvider producer={store}>
				<ItemSlot id={id} unique={unique} selected={selected} affordable={affordable} />
			</ReflexProvider>
		);
	},
);
