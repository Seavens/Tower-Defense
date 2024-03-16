import { palette } from "../utils/palette";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function ItemSlot(): Element {
	const imageId = "rbxassetid://9320108837";
	return (
		<imagelabel
			key={"Item Frame"}
			Size={UDim2.fromOffset(105, 105)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={palette.black.Lerp(palette.white, 0.5)}
			Transparency={0}
			ClipsDescendants={true}
			ZIndex={1}
			LayoutOrder={1}
			BorderSizePixel={5}
			BorderMode={Enum.BorderMode.Inset}
			BorderColor3={palette.black}
			ImageTransparency={0.5}
			Image={imageId}
		/>
	);
}
