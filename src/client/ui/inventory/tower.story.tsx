import { CreateReactStory } from "@rbxts/ui-labs";

import { ReflexProvider } from "@rbxts/react-reflex";
import { Tower } from "./tower";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

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
		const { visible } = controls;
		return (
			<ReflexProvider producer={store}>
				<Tower />
			</ReflexProvider>
		);
	},
);
