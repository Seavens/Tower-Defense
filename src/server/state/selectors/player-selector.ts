import { DATA_TEMPLATE } from "shared/types/data";
import type { PlayerData } from "shared/types/data";
import type { ServerState } from "../producer";

export function selectPlayerState(user: string): (state: ServerState) => PlayerState {
	return function (state: ServerState): PlayerState {
		const { data } = state;
		const { player } = data;
		let result = player[user];
		if (result === undefined) {
			result = { data: DATA_TEMPLATE.player };
		}
		return result;
	};
}

export function selectPlayerData(user: string): (state: ServerState) => PlayerData {
	return function (state: ServerState): PlayerData {
		const Player = selectPlayerState(user)(state);
		return Player.data;
	};
}
