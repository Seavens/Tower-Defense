import { RarityId } from "shared/types/ids/rarity-id";
import { TowerId } from "shared/types/ids/tower-id";
import type { TowerDefinition } from "shared/types/definitions/tower-definition";

export const sniperTower: TowerDefinition<TowerId.Sniper> = {
	id: TowerId.Sniper,
	name: "Sniper Tower",
	desc: "A sniper tower that attacks enemies from a distance.",
	damage: [53, 63],
	range: [65, 70],
	cooldown: [6, 10],
	kind: undefined,
	count: 3,
	startCost: 500,
	rarity: RarityId.Legendary,
	imageId: `rbxassetid://12270286289`,
};
