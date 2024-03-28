import { Players } from "@rbxts/services";

export async function idToName(id: number): Promise<string> {
	const [success, user] = pcall(() => Players.GetNameFromUserIdAsync(id));
	if (!success || user === undefined) {
		return "Unknown";
	}
	return user;
}
