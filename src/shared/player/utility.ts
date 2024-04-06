import { Players } from "@rbxts/services";
import type { Entity } from "./api";

export namespace PlayerUtility {
	export function getUser(playerOrEntity: Player | Entity): string {
		if (typeIs(playerOrEntity, "Instance")) {
			const player = playerOrEntity;
			const user = player.Name;
			return user;
		}
		const entity = playerOrEntity;
		const { user } = entity;
		return user;
	}

	export function getPlayer(user: string): Option<Player> {
		const player = Players.FindFirstChild(user);
		if (player === undefined || !player.IsA("Player")) {
			return undefined;
		}
		return player;
	}
}
