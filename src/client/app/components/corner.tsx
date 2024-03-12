import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface CornerProps {
	pos: UDim2;
	outSize: UDim2;
	innerSize: UDim2;
	rotation: number;
}

export function Corner({ pos, outSize, innerSize, rotation }: CornerProps): Element {
	return (
		<imagelabel
			key={"Inventory Frame Outter Border"}
			Size={UDim2.fromScale(outSize.X.Scale, outSize.Y.Scale)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(pos.X.Scale, pos.Y.Scale)}
			BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
			Image={`rbxassetid://12790545456`}
			ImageTransparency={0.5}
			BorderSizePixel={0}
			Rotation={rotation}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<imagelabel
				key={"Inventory Frame Outter Border"}
				Size={UDim2.fromScale(innerSize.X.Scale, innerSize.Y.Scale)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundColor3={new Color3(0.56, 0.53, 0.33)}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
				BorderSizePixel={0}
			></imagelabel>
		</imagelabel>
	);
}
