import { TowerDefinitions } from "shared/definitions/towers";
import { rarityDefinitions } from "shared/definitions/rarities";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { Tower } from "shared/types/objects";

interface ItemSlotProps {
	tower: Tower;
}

export function ItemSlot(props: ItemSlotProps): Element {
	const { id, level } = props.tower;
	const { imageId, rarity, cost } = TowerDefinitions[id];
	const { color } = rarityDefinitions[rarity];

	return (
		<frame
			key={"ItemSlot Invisiable Frame"}
			Size={new UDim2(0.8, 0, 0.8, 0)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BorderSizePixel={0}
			Transparency={1}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<imagelabel
				key={"ItemSlot Frame Outter Border"}
				Size={new UDim2(1, 0, 1, 0)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(1, 1, 1), 0.5)}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<imagelabel
					key={"ItemSlot Frame Inner Border"}
					Size={new UDim2(0.95, 0, 0.95, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(color[0], color[1], color[2])}
					Image={`rbxassetid://12790545456`}
					ImageTransparency={0.5}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<imagebutton
						key={"ItemSlot ImageButton"}
						Size={new UDim2(1, 0, 1, 0)}
						Position={new UDim2(0.5, 0, 1, 0)}
						AnchorPoint={new Vector2(0.5, 1)}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Image={`http://www.roblox.com/asset/?id=${imageId}`}
					>
						<uicorner CornerRadius={new UDim(0.15, 0)} />
					</imagebutton>
					<frame
						key={"Level Frame Outter Border"}
						Size={new UDim2(0.245, 0, 0.245, 0)}
						Position={new UDim2(0.16, 0, 0.16, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={0.5}
						BorderSizePixel={0}
						BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(1, 1, 1), 0.25)}
					>
						<frame
							key={"Level Frame Inner Border"}
							Size={new UDim2(0.935, 0, 0.935, 0)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundTransparency={0.5}
							BorderSizePixel={0}
							BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(1, 1, 1), 0.95)}
						>
							<uicorner CornerRadius={new UDim(0.5, 0)} />
							<textlabel
								key={"Level Text"}
								Size={new UDim2(0.8, 0, 0.8, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Text={`${level}`}
								TextScaled={true}
								BackgroundTransparency={1}
								TextColor3={new Color3(1, 1, 1)}
								TextStrokeColor3={new Color3(0, 0, 0)}
								TextStrokeTransparency={0}
							/>
						</frame>
						<uicorner CornerRadius={new UDim(0.5, 0)} />
					</frame>
					<uicorner CornerRadius={new UDim(0.15, 0)} />

					<imagelabel
						key={"Cost Frame Outter Border"}
						Size={new UDim2(0.75, 0, 0.125, 0)}
						Position={new UDim2(0.5, 0, 1, 0)}
						AnchorPoint={new Vector2(0.5, 1)}
						BorderSizePixel={0}
						BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(0, 0, 0), 0.95)}
						Image={`rbxassetid://12790545456`}
						ImageTransparency={0.5}
					>
						<imagelabel
							key={"Cost Frame inner Border"}
							Size={new UDim2(0.9625, 0, 0.9, 0)}
							Position={new UDim2(0.5, 0, 1.0, 0)}
							AnchorPoint={new Vector2(0.5, 1)}
							BorderSizePixel={0}
							BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(0, 0, 0), 0.65)}
							Image={`rbxassetid://12790545456`}
							ImageTransparency={0.5}
						>
							<textlabel
								key={"Cost Text"}
								Size={new UDim2(0.925, 0, 0.925, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Text={`$${cost}`}
								TextScaled={true}
								BackgroundTransparency={1}
								TextColor3={new Color3(1, 1, 1)}
								TextStrokeColor3={new Color3(0, 0, 0)}
								TextStrokeTransparency={0}
							/>
						</imagelabel>
					</imagelabel>
				</imagelabel>
			</imagelabel>
		</frame>
	);
}
