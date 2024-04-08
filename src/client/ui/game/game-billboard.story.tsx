import { CreateReactStory } from "@rbxts/ui-labs";
import { GameStatus } from "./game-status";
import { MapId } from "shared/map/types";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Game",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			health: 875,
			mapId: MapId.Test,
			wave: 5,
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { health, wave, mapId } = controls;
		return (
			<ReflexProvider producer={store}>
				<GameStatus health={health} wave={wave} mapId={mapId} />
			</ReflexProvider>
		);
	},
);
