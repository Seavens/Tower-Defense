import type { SharedState } from "shared/state/slices";
import type { Status, StatusId } from "./types";
import type { StatusState } from "./slice";

export function selectStatusState(state: SharedState): StatusState {
	const { status } = state;
	return status;
}

export function selectStatusesByUser(user: string): (state: SharedState) => Option<Map<StatusId, Status>> {
	return function (state: SharedState): Option<Map<StatusId, Status>> {
		const status = selectStatusState(state);
		const statuses = status[user] ?? {};
		return statuses;
	};
}
