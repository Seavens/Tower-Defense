import { CreateReactStory } from "@rbxts/ui-labs";
import { Players } from "@rbxts/services";
import { ReflexProvider } from "@rbxts/react-reflex";
import { SettingsMenu } from ".";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Settings",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			visable: true,
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { visable } = controls;

		store.resetState();

		return (
			<ReflexProvider producer={store}>
				<SettingsMenu visible={visable} />
			</ReflexProvider>
		);
	},
);
