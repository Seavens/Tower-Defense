import type { Entity } from "shared/api/entity";

export class EntityUtility {
	public static getUser(playerOrEntity: Player | Entity): string {
		if (typeIs(playerOrEntity, "Instance")) {
			const player = playerOrEntity;
			const user = player.Name;
			return user;
		}
		const entity = playerOrEntity;
		const { user } = entity;
		return user;
	}
}
