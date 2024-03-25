// Resourced from Littensy: https://github.com/littensy/slither
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
			Size={outSize}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={pos}
			BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
			Image={`rbxassetid://12790545456`}
			ImageTransparency={0.5}
			BorderSizePixel={0}
			Rotation={rotation}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<imagelabel
				Size={innerSize}
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
