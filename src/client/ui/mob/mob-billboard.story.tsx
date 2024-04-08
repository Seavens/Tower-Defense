import { CreateReactStory } from "@rbxts/ui-labs";
import { Mob } from "client/mob/class";
import { MobHealthbar } from "./health-bar";
import { MobId } from "shared/mob/types";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createUUID } from "shared/utility/create-uuid";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Mob",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			mobId: MobId.Zombie,
			currentHealth: 75,
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { mobId, currentHealth } = controls;
		return (
			<ReflexProvider producer={store}>
				{/* <MobHealthbar mobId={mobId} currentHealth={currentHealth} /> */}
			</ReflexProvider>
		);
	},
);
