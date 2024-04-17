import { GameStatus } from "shared/game/types";
import { GameStatusUI } from "./game-status";
import { MapId } from "shared/game/map/types";
import { selectGameData } from "shared/game/selectors";
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
