import { Choose, CreateReactStory, Number } from "@rbxts/ui-labs";
import { GameStatusUI } from "./game-status";
import { Modding } from "@flamework/core";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";
import type { GameStatus } from "shared/game/types";
import type { MapId } from "shared/game/map/types";

const allMapIds = Modding.inspect<Array<MapId>>();
const allGameStatuses = Modding.inspect<Array<GameStatus>>();

export = CreateReactStory(
	{
		name: "Game",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			health: Number(1000, 0, math.huge, 1),
			map: Choose(allMapIds, 1),
			wave: Number(1, 1, 15, 1),
			status: Choose(allGameStatuses, 1),
		},
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { health, wave, map, status } = controls;
		return (
			<ReflexProvider producer={store}>
				<GameStatusUI health={health} wave={wave} map={map} status={status} />
			</ReflexProvider>
		);
	},
);
