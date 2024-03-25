import { ItemRarity } from "shared/inventory/types";
import { rarityDefinitions } from "shared/inventory/rarities";

export namespace ItemUtility {
	export function genRandomRarity(): ItemRarity {
		const randomValue = math.random();
		let cumulative = 0;
		const weights = [
			rarityDefinitions[ItemRarity.Rare].weight,
			rarityDefinitions[ItemRarity.Epic].weight,
			rarityDefinitions[ItemRarity.Legendary].weight,
			rarityDefinitions[ItemRarity.Mythical].weight,
		];
		const rarities = [ItemRarity.Rare, ItemRarity.Epic, ItemRarity.Legendary, ItemRarity.Mythical];

		for (const index of $range(1, weights.size())) {
			cumulative += weights[index - 1];
			if (randomValue <= cumulative) {
				return rarities[index - 1];
			}
		}
		return ItemRarity.Rare;
	}

	export function genMultiplier(): number {
		return math.random() + 1;
	}
}
