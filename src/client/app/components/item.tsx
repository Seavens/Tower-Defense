import { Button, Corner, Frame } from "./pretty-components";
import { RarityDefinitions } from "shared/definitions/rarities";
import { TowerDefinitions } from "shared/definitions/towers";
import { fonts } from "../constants/fonts";
import { palette } from "../utils/palette";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { TowerObject } from "shared/types/objects";

interface ItemProps {
	itemKey: string;
	tower: TowerObject;
}

export function Item({ itemKey, tower }: ItemProps): Element {
	const { colorRGB } = RarityDefinitions[TowerDefinitions[tower.id].rarity];
	const color = Color3.fromRGB(colorRGB[0], colorRGB[1], colorRGB[2]);
	const colorDark = Color3.fromRGB(colorRGB[0] * 0.5, colorRGB[1] * 0.5, colorRGB[2] * 0.5);
	const { imageId } = TowerDefinitions[tower.id];

	return (
		<frame
			key={"Item Frame"}
			Size={UDim2.fromOffset(105, 105)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={color}
			ClipsDescendants={true}
			Visible={true}
			ZIndex={1}
			LayoutOrder={1}
			BorderSizePixel={5}
			BorderMode={Enum.BorderMode.Inset}
			BorderColor3={colorDark}
		>
			<Button
				size={UDim2.fromScale(1, 1)}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				backgroundColor={color}
				tower={tower}
				zIndex={0}
			/>
			<textlabel
				key={"Cost"}
				Text={`$${math.round(tower.cost)}`}
				Size={UDim2.fromScale(1, 0.2)}
				Position={UDim2.fromScale(0.5, 0.9)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				TextStrokeColor3={palette.black}
				TextStrokeTransparency={0}
				Font={Enum.Font.GothamMedium}
				TextScaled={true}
				TextColor3={palette.white}
				TextXAlignment={Enum.TextXAlignment.Center}
				TextYAlignment={Enum.TextYAlignment.Center}
				BackgroundColor3={color.Lerp(palette.black, 0.75)}
				ZIndex={2}
			/>
		</frame>
	);
}
