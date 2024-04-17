import { CreateReactStory } from "@rbxts/ui-labs";
import { ItemKind, type ItemTowerUnique } from "shared/inventory/types";
import { Players } from "@rbxts/services";
import { ReflexProvider } from "@rbxts/react-reflex";
import { type ReplicatedTower, TowerTargeting } from "shared/tower/types";
import { TowerBillboard } from "./billboard";
import { createUUID } from "shared/utility/functions/create-uuid";
import { godTowerItem } from "shared/inventory/towers/definitions/god";
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
		const currentOwner = Players.GetNameFromUserIdAsync(math.random(1, 1000000));

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

		const replicatedTower: ReplicatedTower = {
			owner: currentOwner,
			unique: unique,
			id: godTowerItem.id,
			uuid: createUUID(),
			index: 1,
			key: "god-tower",
			upgrades: 3,
			targeting: TowerTargeting.Closest,
			position: new Vector3(0, 0, 0),
		};

		return (
			<ReflexProvider producer={store}>
				<TowerBillboard replicatedTower={replicatedTower} />
			</ReflexProvider>
		);
	},
);
