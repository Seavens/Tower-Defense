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
			musicEnabled: math.random() < 0.5 ? true : false,
			musicVolume: math.random(1, 100),
			sfxEnabled: math.random() < 0.5 ? true : false,
			sfxVolume: math.random(1, 100),
			vfxEnabled: math.random() < 0.5 ? true : false,
			mobBillboardsEnabled: math.random() < 0.5 ? true : false,
			towerBillboardsEnabled: math.random() < 0.5 ? true : false,
			visable: true,
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const {
			musicEnabled,
			mobBillboardsEnabled,
			musicVolume,
			sfxEnabled,
			sfxVolume,
			towerBillboardsEnabled,
			vfxEnabled,
			visable,
		} = controls;

		store.resetState();

		store.profileAdjustMusic({ musicEnabled: musicEnabled, volume: musicVolume });
		store.profileAdjustSfx({ sfxEnabled: sfxEnabled, volume: sfxVolume });
		store.profileAdjustVfx({
			vfxEnabled: vfxEnabled,
			mobBillboards: mobBillboardsEnabled,
			towerBillboards: towerBillboardsEnabled,
		});

		return (
			<ReflexProvider producer={store}>
				<SettingsMenu visible={visable} />
			</ReflexProvider>
		);
	},
);
