import { Players } from "@rbxts/services";

export function getPlayer(user: string): Option<Player> {
	const player = Players.FindFirstChild(user);
	if (player === undefined || !player.IsA("Player")) {
		return undefined;
	}
	return player;
}
