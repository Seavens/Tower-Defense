import { CreateReactStory } from "@rbxts/ui-labs";
import { EnableSettingsRow } from "./enable-row";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Enable Row",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			enabled: true,
			name: "Music",
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { enabled, name } = controls;

		return (
			<ReflexProvider producer={store}>
				<EnableSettingsRow
					enable={enabled}
					settingName={name}
					onClick={(enabled: boolean): void => {
						print(`Enabled: ${enabled}`);
					}}
				/>
			</ReflexProvider>
		);
	},
);
