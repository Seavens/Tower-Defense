import { DATA_TEMPLATE } from "shared/data/constants";
import type { ProfileData } from "shared/data/types";
import type { ProfileState } from "./slice";
import type { ServerState } from "server/state/store";

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

export function selectProfileData(user: string): (state: ServerState) => ProfileData {
	return function (state: ServerState): ProfileData {
		const { data } = selectProfileState(user)(state);
		return data;
	};
}
