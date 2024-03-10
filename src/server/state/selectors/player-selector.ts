import { DATA_TEMPLATE } from "shared/types/data";
import type { ProfileData } from "shared/types/data";
import type { ProfileState } from "../slices/profile-slice";
import type { ServerState } from "../producer";

export function selectProfileState(user: string): (state: ServerState) => ProfileState {
	return function (state: ServerState): ProfileState {
		const { data } = state;
		const { profile } = data;
		let result = profile[user];
		if (result === undefined) {
			result = { data: DATA_TEMPLATE.profile };
		}
		return result;
	};
}

export function selectPlayerData(user: string): (state: ServerState) => ProfileData {
	return function (state: ServerState): ProfileData {
		const { data } = selectProfileState(user)(state);
		return data;
	};
}
