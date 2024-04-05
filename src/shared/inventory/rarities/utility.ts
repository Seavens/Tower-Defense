import { ItemRarity } from "../types";
import { rarityDefinitions } from ".";

export namespace RarityUtility {
	export function getRarity(): ItemRarity {
		const randomValue = math.random();
		let cumulative = 0;
		const weights = [
			rarityDefinitions[ItemRarity.Rare].weight,
			rarityDefinitions[ItemRarity.Epic].weight,
			rarityDefinitions[ItemRarity.Legendary].weight,
			rarityDefinitions[ItemRarity.Mythical].weight,
			rarityDefinitions[ItemRarity.Secret].weight,
		];
		const rarities = [
			ItemRarity.Rare,
			ItemRarity.Epic,
			ItemRarity.Legendary,
			ItemRarity.Mythical,
			ItemRarity.Secret,
		];

		for (const index of $range(1, weights.size())) {
			cumulative += weights[index - 1];
			if (randomValue <= cumulative) {
				return rarities[index - 1];
			}
		}
		return ItemRarity.Rare;
	}
}
