import { GameStatus } from "shared/game/types";
import { GameStatusUI } from "./game-status";
import { MapId } from "shared/map/types";
import { selectCurrentMap, selectCurrentWave, selectGameData, selectGameStatus } from "shared/game/selectors";
import { store } from "client/state/store";
import { useSelector } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function GameApp(): Option<Element> {
	const { health, wave, status, map } = useSelector(selectGameData);
	if (status === GameStatus.None) {
		return undefined;
	}
	return <GameStatusUI health={health} wave={wave} map={map === undefined ? MapId.Test : map} status={status} />;
}
