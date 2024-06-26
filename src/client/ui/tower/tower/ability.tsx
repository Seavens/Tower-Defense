import { Button, Group, Text } from "client/ui/components";
import { Events } from "client/network";
import { FONTS } from "client/ui/constants";
import { Latte } from "@rbxts/catppuccin";
import { TOWER_ABILITY_SIZE } from "../constants";
import { useDarkenedColor, usePx, useRarityColor } from "client/ui/hooks";
import { useTowerDefintion } from "../hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerAbility } from "shared/inventory/towers/abilities/types";

interface TowerAbilityProps {
	tower: ReplicatedTower;
	ability: TowerAbility;
}

export function TowerAbilityUI({ tower, ability }: TowerAbilityProps): Element {
	const { id, key } = tower;

	const px = usePx();

	const definition = useTowerDefintion(id);

	const rarity = useRarityColor(definition.rarity);
	const darker = useDarkenedColor(rarity, 0.7);

	return (
		<Group
			size={UDim2.fromOffset(px(TOWER_ABILITY_SIZE.X) - px(4) * 3, px(TOWER_ABILITY_SIZE.Y))}
			anchorPoint={new Vector2(0, 0.5)}
			position={UDim2.fromScale(0, 0.5)}
			key={"ability-group"}
		>
			<Button
				size={UDim2.fromScale(1, 1)}
				anchorPoint={new Vector2(0, 0.5)}
				position={UDim2.fromScale(0, 0.5)}
				cornerRadius={new UDim(0, px(3))}
				backgroundColor={darker}
				onClick={(): void => {
					Events.tower.ability(key, ability);
				}}
				key={"ability-button"}
			>
				<Text
					size={UDim2.fromScale(1, 1)}
					position={UDim2.fromScale(0.5, 0.5)}
					anchorPoint={Vector2.one.mul(0.5)}
					backgroundTransparency={1}
					font={FONTS.inter.medium}
					textColor={Latte.Base}
					textSize={px(14)}
					text={ability}
					richText={true}
					textWrapped={true}
				/>
				<uipadding
					PaddingBottom={new UDim(0, px(4))}
					PaddingLeft={new UDim(0, px(4))}
					PaddingRight={new UDim(0, px(4))}
					PaddingTop={new UDim(0, px(4))}
					key={"ability-padding"}
				/>
			</Button>
		</Group>
	);
}
