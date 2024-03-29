import { Button, Frame, Group, Image } from "../components";
import { Darken, Lighten } from "@rbxts/colour-utils";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { TOWER_SIZE } from "../inventory/constants";
import { useAbbreviator, usePx } from "../hooks";
import { useTowerDefintion } from "./hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ItemId, ItemTowerClass, TowerItemId } from "shared/inventory/types";

interface TowerProps {
	unique: ItemTowerClass;
	id: TowerItemId;
	onClick?: (id: ItemId) => void;
}

const BACKGROUND = Mocha.Base;
const OUTLINE = Darken(BACKGROUND, 0.25);
const BACKGROUND_LIGHT = Lighten(Mocha.Base, 0.1);
const THICKNESS = 4;
const TEXTCOLOR = Latte.Base;

export function Tower({ onClick, id, unique }: TowerProps): Element {
	const px = usePx();
	const abbreviator = useAbbreviator();
	const definition = useTowerDefintion(id);

	return (
		<Group
			size={UDim2.fromOffset(px(TOWER_SIZE.X), px(TOWER_SIZE.Y))}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			key={"tower-group"}
		>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={BACKGROUND}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				cornerRadius={new UDim(0, 12)}
				key={"tower-frame"}
			>
				<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<Image
					size={UDim2.fromOffset(px(200), px(200))}
					cornerRadius={new UDim(0, 12)}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0.025, 0.5)}
					image={definition.image}
				>
					<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
					<Button size={UDim2.fromScale(1, 1)} onClick={() => onClick?.(id)}></Button>
				</Image>
			</Frame>
		</Group>
	);
}
