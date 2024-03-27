import { Players } from "@rbxts/services";

//  !! Have to make not Async
export function idToName(id: number): string {
	const user = Players.GetNameFromUserIdAsync(id);
	if (user === undefined) {
		return "Unknown";
	}
	return user;
}
