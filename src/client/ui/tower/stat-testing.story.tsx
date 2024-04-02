import { Choose, CreateReactStory, Number } from "@rbxts/ui-labs";
import { Modding } from "@flamework/core";
import { TowerUtil } from "shared/tower/utils";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { TowerItemId } from "shared/inventory/types";

const allTowerItemIds = Modding.inspect<Array<TowerItemId>>();

export = CreateReactStory(
	{
		name: "Cooldown Testing",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			id: Choose(allTowerItemIds, 1),
			duration: Number(1, 0, math.huge),
			stat: Choose(["damage", "cooldown", "range"], 1),
		},
	},
	({ controls }): Element => {
		const { id, duration, stat } = controls;
		warn(TowerUtil.calculateMultiplier(id, duration, stat));

		return <></>;
	},
);
