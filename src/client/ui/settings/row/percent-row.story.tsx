import { CreateReactStory } from "@rbxts/ui-labs";
import { PercentSettingsRow } from "./percent-row";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "PercentRow",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			volume: 1,
			name: "Music Volume",
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { volume, name } = controls;

		return (
			<ReflexProvider producer={store}>
				<PercentSettingsRow percent={volume} settingName={name} />
			</ReflexProvider>
		);
	},
);
