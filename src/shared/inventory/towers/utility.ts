import { ITEM_RNG_MAX, ITEM_RNG_MIN } from "shared/inventory/constants";

export namespace TowerUtility {
	export function getMultiplier(): number {
		return math.random() * (ITEM_RNG_MAX - ITEM_RNG_MIN) + ITEM_RNG_MIN;
	}
}
