import { DATA_TEMPLATE } from "shared/types/data";
import type { ClientState } from "../producer";
import type { ProfileData } from "shared/types/data";
import type { ProfileState } from "../slices/player-slice";

export function selectProfileState(state: ClientState): ProfileState {
	const { profile } = state;
	let result = profile;
	if (result === undefined) {
		result = { data: DATA_TEMPLATE.profile };
	}
	return result;
}

export function selectProfileData(state: ClientState): ProfileData {
	const { data } = selectProfileState(state);
	return data;
}
