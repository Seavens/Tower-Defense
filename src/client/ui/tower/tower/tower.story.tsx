import { Choose, CreateReactStory, Number } from "@rbxts/ui-labs";
import { ItemKind } from "shared/inventory/types";
import { MAX_TOWER_LEVEL } from "shared/tower/constants";
import { Modding } from "@flamework/core";
import { ReflexProvider } from "@rbxts/react-reflex";
import { Tower } from ".";
import { createUUID } from "shared/utility/create-uuid";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { ReplicatedTower, TowerTargeting } from "shared/tower/types";

const allTowerItemIds = Modding.inspect<Array<TowerItemId>>();
const allTowerTargetings = Modding.inspect<Array<TowerTargeting>>();

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
		name: "Tower",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			id: Choose(allTowerItemIds, 1),
			targeting: Choose(allTowerTargetings, 1),
			upgrades: Number(0, 0, math.huge, 1),
			level: Number(1, 1, MAX_TOWER_LEVEL, 1),
			experience: Number(1, 1, math.huge, 1),
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { id, targeting, upgrades, level, experience } = controls;
		const uuid = createUUID();
		unique.level = level;
		unique.experience = experience;
		const tower: ReplicatedTower = {
			id,
			index: 1,
			key: "TEST_DEV",
			owner: "DEV",
			position: Vector3.zero,
			targeting,
			upgrades,
			uuid,
			unique,
		};

		return (
			<ReflexProvider producer={store}>
				<Tower tower={tower} />
			</ReflexProvider>
		);
	},
);
