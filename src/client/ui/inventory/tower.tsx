import { Button, Frame, Group, Image } from "../components";
import { Darken, Lighten } from "@rbxts/colour-utils";
import { TOWER_SIZE } from "./constants";

import { Latte, Mocha } from "@rbxts/catppuccin";

import { type Item, type ItemId, ItemKind } from "shared/inventory/types";
import { usePx } from "../hooks";
import Abbreviator from "@rbxts/abbreviate";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ItemTowerClass, TowerItemId } from "shared/inventory/types";

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
	const abbreviator = new Abbreviator();

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
					// image={tower?.image}
				>
					<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
					<Button
						size={UDim2.fromScale(1, 1)}
						onClick={() => {
							if (onClick) {
								if (item.unique.kind !== ItemKind.Tower) {
									return;
								}
								onClick(item.id);
							}
						}}
					></Button>
				</Image>
			</Frame>
		</Group>
	);
}
