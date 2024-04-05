import { ItemRarity } from "shared/inventory/types";
import { PALETTE } from "client/ui/constants";
import { rarityDefinitions } from "shared/inventory/rarities";
import { useLifetime } from "@rbxts/pretty-react-hooks";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";

export function useRarityColor(rarity?: ItemRarity): BindingOrValue<Color3> {
	const lifetime = useLifetime();
	if (rarity === undefined) {
		return PALETTE.black;
	}
	const { color } = rarityDefinitions[rarity];
	return rarity === ItemRarity.Mythical
		? lifetime.map((value: number): Color3 => Color3.fromHSV((value % 10) / 10, 1, 1))
		: color;
}
