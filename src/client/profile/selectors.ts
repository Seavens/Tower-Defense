import { DATA_TEMPLATE } from "shared/data/constants";
import type { ClientState } from "../state/store";
import type { ProfileData } from "shared/data/types";
import type { ProfileState } from "./slice";

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
