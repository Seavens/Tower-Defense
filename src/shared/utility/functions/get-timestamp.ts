import { Workspace } from "@rbxts/services";

export function getTimestamp(): number {
	const timestamp = Workspace.GetServerTimeNow();
	return timestamp;
}
