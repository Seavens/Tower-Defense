import { Boolean, Choose, CreateReactStory } from "@rbxts/ui-labs";
import { InventorySlot } from ".";
import { Modding } from "@flamework/core";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { ItemId } from "shared/inventory/types";

const allItemIds = Modding.inspect<Array<ItemId>>();

export = CreateReactStory(
	{
		name: "Inventory Slot v2",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			id: Choose(allItemIds, 0),
			locked: Boolean(false),
			enabled: Boolean(true),
			selected: Boolean(true),
		},
	},
	({ controls }): Element => {
		const { id, locked, enabled, selected } = controls;

		return (
			<InventorySlot
				id={id}
				locked={locked}
				level={1}
				enabled={enabled}
				selected={selected}
				menu={!enabled}
				layoutOrder={1}
			/>
		);
	},
);
