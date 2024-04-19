import { CreateReactStory } from "@rbxts/ui-labs";
import { KeySettingsRow } from "./key-row";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Key Settings",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			name: "Slot One",
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { name } = controls;

		return (
			<ReflexProvider producer={store}>
				<KeySettingsRow keyCode={Enum.KeyCode.One} layoutOrder={0} settingName={name} />
			</ReflexProvider>
		);
	},
);
